"use client"
import { Button } from "@/components/ui/button"
import CourseAffichage from '@/components/course-affichage'


import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { tokenName } from "@/lib/affinis"
import { useCourseTaxiContext } from '@/providers/course-taxi-provider'


export default function CourseAction({ open, setOpen, coursesSel, filtre, rgpId, tripId }) {
	const { courses} = useCourseTaxiContext()
console.log("------------------------- CourseAction -------------------- ", rgpId, tripId, coursesSel)
	enum ActionType {
		Inconnue = 0,
		ACloturer = 2,
		Proposition = 1,
	}
	const [typeAction, setTypeAction] = useState<number>(ActionType.Inconnue)
	const [title, setTitle] = useState<string>("")
	const [description, setDescription] = useState<string>("")
	// const [ buttonLabel, setButtonLabel] = useState<string>("")
	const [isButtonsVisible, setIsButtonsVisible] = useState<boolean>(true)
	const [message, setMessage] = useState("En attente d'une réponse du serveur")
	// const [refresh, setRefresh] = useState<number>(0)

	function setACloturer() {
		setTypeAction(ActionType.ACloturer)
		// setButtonLabel("Oui, je cloture !")
		setTitle("Cloture de regroupement")
		setDescription("Voulez vous cloturer ce regroupement de coursesSel ?")
	}
	function setProposition() {
		setTypeAction(ActionType.Proposition)
		// setButtonLabel("Oui je prends !")
		setTitle("Proposition de coursesSel")
		setDescription("Voulez vous prendre ce regroupement de coursesSel ?")
	}

	/*** .
	*
	* @param 
	* @returns 
	*/
	function analyseRgp(coursesSel:[]): void {
		coursesSel.map((course) => {
			if (course.course_status !== "0") {
				if (course.course_status == "1" && course.taxi_name !== "" && course.taxi_name !== null) {
					setACloturer()
					return null
				}
				if (course.course_status == "1" && (course.taxi_name == "" || course.taxi_name == null)) {
					setProposition()
				}
			}
		})
	}

	async function buttonActionProposition(value: string) {
		setIsButtonsVisible(false)
		const reponse = await fetch(
			process.env.NEXT_PUBLIC_API_URL + '/trip/proposal/answer'
			, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem(tokenName)}`,
					"Content-Type": "application/json",
				},
				method: 'POST',
				body: '{"rideId":"' + rgpId + '", "reponse":"' + value + '" }'
			}
		)
		const retour = await reponse.json();
		if (retour?.retour) {
			// reponse ok
			// passer en vert les datas concernés
			setCoursesAfaire(rgpId)
			// enlever la boite de dialogue
			setOpen(false)
		}
		else{
			setMessage("La course n'est plus attribuable")
			removeCourses(rgpId)

		}
		return retour
	}

	function setCoursesAfaire(rgpId){
		const coursesTmp = courses.courses
		coursesTmp.map((course) => {
			if (course.course_status === "1" && course.rgp_course_id===rgpId) {
				course.taxi_name="tous-sauf-vide"
			}
		})
		// setCourses(coursesTmp)
        const channelCourses = new BroadcastChannel('sw-courses-data');
		channelCourses.postMessage({ courses: coursesTmp, date: Date.now() })
		channelCourses.close()

	}
	function removeCourses(rgpId){
		const coursesTmp = []
		courses.courses.map((course) => {
			if (course.rgp_course_id!==rgpId) {
				coursesTmp.push(course)			
			}
		})
		// setCourses(coursesTmp)
        
		channelCourses = new BroadcastChannel('sw-courses-data');
		channelCourses.postMessage({ courses: coursesTmp, date: Date.now() })
		channelCourses.close()

	}

	async function buttonActionCloturer() {

		setIsButtonsVisible(false)
		const reponse = await fetch(
			process.env.NEXT_PUBLIC_API_URL + '/trip/cloture'
			, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem(tokenName)}`,
					"Content-Type": "application/json",
				},
				method: 'POST',
				body: '{"tripId":"' + tripId  + '" }'
			}
		)
		const retour = await reponse.json();
		if (retour?.retour) {
			// reponse ok
			// passer en vert les datas concernés
			setCloture(tripId)
			// enlever la boite de dialogue
			setOpen(false)
		}
		else{
			setMessage(retour?.message)

		}
		return retour
	}

	function setCloture(tripId){
		const coursesTmp = courses.courses
		coursesTmp.map((course) => {
			if (course.course_status === "1" && course.course_id===tripId) {
				course.course_status="2"
			}
		})
		// setCourses(coursesTmp)
		const channelCourses = new BroadcastChannel('sw-courses-data');
		channelCourses.postMessage({ courses: coursesTmp, date: Date.now() })
		channelCourses.close()
	}

	// analyseRgp(datas)
	useEffect(() => {
		// setDatas( getcoursesSelForRgpId(coursesSel.datas.data, rgpId))
		analyseRgp(coursesSel)
		// setTitlea("Proposition de coursesSel")
	})

	// proposition
	// useEffect(() => {
	// 	console.log("-------------------------- USEEFFECT CourseAction refresh -------------------------------")

	// 	async function doRequete() {
	// 		const reponse = await fetch(
	// 			process.env.NEXT_PUBLIC_API_URL + '/trip/proposal/answer'
	// 			, {
	// 				headers: {
	// 					'Authorization': `Bearer ${localStorage.getItem(tokenName)}`,
	// 					"Content-Type": "application/json",
	// 				},
	// 				method: 'POST',
	// 				body: '{"rideId":"' + rgpId + '", "password":"' + value + '" }'
	// 			}
	// 		)
	// 		const retour = await reponse.json();

	// 		console.log("retour", rgpId, value, retour)
	// 		if (retour?.message) {
	// 			console.log("message", message)
	// 			setMessage(retour?.message)
	// 		}
	// 	}
	// }, [refresh])

	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<CourseAffichage filtreCourse={filtre} courses={coursesSel} clickable={false} />
					{!isButtonsVisible &&
						<div className="text-center">
							{message}
						</div>

					}
					<DialogFooter>
						{isButtonsVisible &&
							<>
								<Button className="mr-3" onClick={() => { setOpen(false) }}>Fermer</Button>
								{(typeAction === ActionType.Proposition) &&
									<>
										<Button onClick={() => { buttonActionProposition("0") }}>Refuser</Button>
										<Button onClick={() => { buttonActionProposition("1") }}>Accepter</Button>
									</>
								}
								{(typeAction === ActionType.ACloturer) &&
									<>
										<Button onClick={() => { buttonActionCloturer() }}>Cloturer</Button>
									</>
								}
							</>
						}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

