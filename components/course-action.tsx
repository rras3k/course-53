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
// import { useCourseTaxiContext } from '@/providers/course-taxi-provider'


export default function CourseAction({ open, setOpen, courses, coursesSel, filtre, rgpId, tripId }) {
	// const { courses } = useCourseTaxiContext()
	console.log("------------------------- CourseAction -------------------- ", rgpId, tripId, coursesSel)
	enum ActionType {
		Inconnue = 0,
		ACloturer = 2,
		Proposition = 1,
		vueAnnulation = 3
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
		setTitle("Clôture d'une course")
		setDescription("Voulez vous clôturer cette course ?")
	}
	function setProposition() {
		setTypeAction(ActionType.Proposition)
		// setButtonLabel("Oui je prends !")
		setTitle("Proposition de regroupement")
		setDescription("Voulez vous prendre ce regroupement ?")
	}
	function setVuAnnulation() {
		setTypeAction(ActionType.vueAnnulation)
		// setButtonLabel("Oui je prends !")
		setTitle("Masquer une annulation")
		setDescription("Voulez vous masquer cette course ?")
	}

	/*** .
	*
	* @param 
	* @returns 
	*/
	function analyseRgp(coursesSel: []): void {
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
			if (course.course_status == "0" && course.masque == "0") {
				setVuAnnulation()
			}
		})
	}


	// --------------------------------------------------------- PROPOSITION -----------------------------------------------------------

	/*** .
	*
	* @param 
	* @returns 
	*/
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
		console.log("attente retour de confirmation prise de course")
		const retour = await reponse.json();
		if (retour?.retour) {
			let coursesTmp = []
			// reponse ok
			if (value == "1") { // le taxi avait dit "oui"
				// passer en vert les datas concernés
				const coursesTmp = setCoursesAfaire(rgpId)
			}
			else { // le taxi avait dit "non"
				const coursesTmp = removeCourses(rgpId)
			}
			// enlever la boite de dialogue
			setOpen(false)

			// Envoi un message
			const channelCourseschanged = new BroadcastChannel('course-changed');
			channelCourseschanged.postMessage({ trips: coursesTmp })
			channelCourseschanged.close()

		}
		else {
			setMessage("La course n'est plus attribuable")
			removeCourses(rgpId)

		}
		return retour
	}

	/*** .
	*
	* @param 
	* @returns 
	*/
	function setCoursesAfaire(rgpId) {
		const coursesTmp = courses
		coursesTmp.map((course) => {
			if (course.course_status === "1" && course.rgp_course_id === rgpId) {
				course.taxi_name = "tous-sauf-vide"
			}
		})
		// setCourses(coursesTmp)
		// const channelCourses = new BroadcastChannel('sw-flow-server-data');
		// channelCourses.postMessage({ courses: coursesTmp, date: Date.now() })
		// channelCourses.close()
		return coursesTmp
	}

	function removeCourses(rgpId) {
		const coursesTmp = courses
		let indice = 0
		let indicesToRemove = []

		coursesTmp.map((course) => {
			if (course.rgp_course_id === rgpId) {
				indicesToRemove.unshift(indice)
			}
			indice++
		})
		indicesToRemove.map((ind) => {
			coursesTmp.splice(ind, 1)
		})

		// const channelCourses = new BroadcastChannel('sw-flow-server-data');
		// channelCourses.postMessage({ courses: coursesTmp, date: Date.now() })
		// channelCourses.close()
		return coursesTmp

	}

	// --------------------------------------------------------- CLOTURER -----------------------------------------------------------

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
				body: '{"tripId":"' + tripId + '" }'
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
		else {
			setMessage(retour?.message)

		}
		return retour
	}

	function setCloture(tripId) {
		const coursesTmp = courses
		coursesTmp.map((course) => {
			if (course.course_status === "1" && course.course_id === tripId) {
				course.course_status = "2"
			}
		})
		// setCourses(coursesTmp)
		const channelCourses = new BroadcastChannel('sw-flow-server-data');
		channelCourses.postMessage({ courses: coursesTmp, date: Date.now() })
		channelCourses.close()
	}

	// --------------------------------------------------------- ANNULATION -----------------------------------------------------------

	async function buttonActionVuAnnulation() {

		setIsButtonsVisible(false)
		const reponse = await fetch(
			process.env.NEXT_PUBLIC_API_URL + '/trip/masque'
			, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem(tokenName)}`,
					"Content-Type": "application/json",
				},
				method: 'POST',
				body: '{"tripId":"' + tripId + '" }'

			}
		)
		const retour = await reponse.json();
		if (retour?.retour) {
			// reponse ok
			// passer en vert les datas concernés
			setVuAnnulation(tripId)
			// enlever la boite de dialogue
			setOpen(false)
		}
		else {
			setMessage(retour?.message)

		}
		return retour
	}

	useEffect(() => {
		analyseRgp(coursesSel)
	})


	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						{/* <DialogDescription>{description}</DialogDescription> */}
					</DialogHeader>

					<CourseAffichage filtreCourse={filtre} courses={coursesSel} clickable={false} />

					{!isButtonsVisible &&
						<div className="text-center">
							{message}
						</div>
					}
					<DialogFooter >
						{isButtonsVisible &&
							<div className="flex flex-co justify-center ">
								{(typeAction === ActionType.Proposition) &&
									<>
										{/* <Button className="mr-3 " variant="secondary" onClick={() => { setOpen(false) }}>Fermer</Button> */}
										<Button className="mr-3 " onClick={() => { buttonActionProposition("0") }}>Refuser</Button>
										<Button className="mr-3 " onClick={() => { buttonActionProposition("1") }}>Accepter</Button>
									</>
								}
								{(typeAction === ActionType.ACloturer) &&
									<>
										{/* <Button className="mr-3 " variant="secondary" onClick={() => { setOpen(false) }}>Fermer</Button> */}
										<Button className="mr-3 " onClick={() => { buttonActionCloturer() }}>Cloturer</Button>
									</>
								}
								{(typeAction === ActionType.vueAnnulation) &&
									<>
										{/* <Button className="mr-3 " variant="secondary" onClick={() => { setOpen(false) }}>Fermer</Button> */}
										<Button className="mr-3 " onClick={() => { buttonActionVuAnnulation() }}>Masquer</Button>
									</>
								}
							</div>
						}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

