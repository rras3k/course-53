"use client"

import { Filtre_course_url_query, Course_statut } from "@/lib/affinis";
import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import CourseAction from "./course-action";
import { useState } from 'react';
import { Users } from 'lucide-react';
import React from 'react'
import { Button } from "./ui/button";
import { ExternalLink } from 'lucide-react';




export default function CourseAffichage({ filtreCourse, clickable, courses }) {

	enum ActionType {
		Rien = 0,
		Proposition = 1,
		ACloturer = 2,
		vueAnnulation = 3
	}
	enum CourseType {
		AFaire = 1,
		Proposition = 2,
		Cloture = 3,
		Annule = 4
	}

	type displayTripType = {
		btnMessage: string
		actionType: ActionType
		courseType: CourseType
		firstOfRgp: boolean
		lastOfRgp: boolean
	}

	function getCoursesForRgpId(courses: [], rgpId: string): [] {
		console.log("getCoursesForRgpId", rgpId)
		const dataRet: [] = []
		courses?.map((course) => {
			if (course.rgp_course_id === rgpId) {
				dataRet.push(course)
			}
		})
		return dataRet
	}

	function getCoursesForTripId(courses: [], tripId: string): [] {
		console.log("getCoursesForTripId", tripId)

		const dataRet: [] = []
		courses?.map((course) => {
			if (course.course_id === tripId) {
				dataRet.push(course)
			}
		})
		return dataRet
	}

	// console.log("COURSE AFDFICHAGE COMPOENENT", courses)
	const [open, setOpen] = useState(false);
	const [coursesToDialog, setCoursesToDialog] = useState<[]>();
	const [rgpId, setRgpId] = useState<string>("");
	const [tripId, setTripId] = useState<string>("");


	const clickRegroupement = (rgpCourseId: string, tripId: string, status: string, taxi_name: string, masque:string) => {
		if (clickable) {
			if (status == "1" && (taxi_name == "" || taxi_name == null)) {
				// proposition, donc on envoie le regroupement
				const dateSel: [] = getCoursesForRgpId(courses, rgpCourseId)
				setCoursesToDialog(dateSel)
				setRgpId(rgpCourseId)
				// setTripId(tripId)
				setOpen(true);
			}
			else if (status == "1") {
				// demande de cloture
				const dateSel: [] = getCoursesForTripId(courses, tripId)
				setCoursesToDialog(dateSel)
				// setRgpId(rgpCourseId)
				setTripId(tripId)
				setOpen(true);
			}
			else if (status == "0" && masque=="0") {
				// demande de masquer l'annulation
				const dateSel: [] = getCoursesForTripId(courses, tripId)
				setCoursesToDialog(dateSel)
				// setRgpId(rgpCourseId)
				setTripId(tripId)
				setOpen(true);
			}
		}
	}

	function clickVu(tripId: string) {

	}

	let rgp_course_id_before: string = "";
	let isCourseToDo: boolean;
	let isBtnVu: boolean;
	let trouve = false
	const d = new Date();
	const heureCourante = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	// console.log("Affichage des courses ", filtreCourse, datas)
	console.log("AFFICHAGE COURSES", courses)



	let courseDisplay = []
	if (Array.isArray(courses) && courses.length > 0) {  // Mise en place de différents indicateurs pour l'affichage des course
		let rgp_course_id_before = ""
		let indice = 0
		courses.map((course) => {
			const courseTmp = course
			let displayTrip: displayTripType
			let lastOfRgp: boolean

			lastOfRgp = true

			const isNewRgp = rgp_course_id_before !== course.rgp_course_id
			if ((indice + 1) == courses.length) {
				lastOfRgp = true
			}
			else {
				if (courses[indice + 1].rgp_course_id == course.rgp_course_id) {
					lastOfRgp = false
				}
				else {
					lastOfRgp = true
				}
			}
			// const lastOfRgp = (indice + 1) > courses.length && courses[indice + 1].rgp_course_id == course.rgp_course_id ? false : true


			if (course.course_status == "0") {  // course annulée
				displayTrip = {
					courseType: CourseType.Annule,
					btnMessage: course.masque == "0" ? "Masquer cette course annulée ?" : "",
					actionType: course.masque == "0" ? ActionType.vueAnnulation : ActionType.Rien,
					firstOfRgp: isNewRgp,
					lastOfRgp: lastOfRgp
				}
			}
			if (course.course_status == "1") {  // course a faire ou proposition
				displayTrip = {
					courseType: (course.taxi_name == "" || course.taxi_name == null) ? CourseType.Proposition : CourseType.AFaire,
					btnMessage: (course.taxi_name == "" || course.taxi_name == null) ? "Prendre cette course ?" : "Clôturer cette course ?",
					actionType: course.masque == (course.taxi_name == "" || course.taxi_name == null) ? ActionType.Proposition : ActionType.ACloturer,
					firstOfRgp: isNewRgp,
					lastOfRgp: lastOfRgp
				}
			}

			if (course.course_status == "2") {  // course déjà cloturé
				displayTrip = {
					courseType: CourseType.Cloture,
					btnMessage: "",
					actionType: ActionType.Rien,
					firstOfRgp: isNewRgp,
					lastOfRgp: lastOfRgp
				}
			}


			isCourseToDo = false
			switch (filtreCourse) {
				case Filtre_course_url_query.A_faire:  // usage normal de fonctionnement vert+ jaune + gris non vu
					if (course.course_status == "1" || (course.course_status == "0" && course.masque == "0")) {
						isCourseToDo = true
					}
					isBtnVu = course.course_status == "0" && course.masque == "0" ? true : false
					break
				case Filtre_course_url_query.Proposition: // que les courses jaunes
					if (course.course_status == "1" && (course.taxi_name == "" || course.taxi_name == null))
						isCourseToDo = true
					break;
				case Filtre_course_url_query.Annulee:  // que les courses grises vu ou pas 
					if (course.course_status == "0")
						isCourseToDo = true
					break;
				case Filtre_course_url_query.Cloturee:  // que les courses bleues
					if (course.course_status == "2")
						isCourseToDo = true
					break;
				case Filtre_course_url_query.Toute:   // toutes ! lol
					isCourseToDo = true
					break;
				default:
					break;
			}
			if (isCourseToDo) {
				courseTmp.displayTrip = displayTrip
				courseDisplay.push(courseTmp)
			}
			indice++
			rgp_course_id_before = course.rgp_course_id;
		})
	}
	console.log("courseDisplay", courseDisplay)


	if (!Array.isArray(courseDisplay) || courseDisplay.length == 0) return (<div>Pas de course pour le moment</div>)

	return (
		<>
			{Array.isArray(courseDisplay) && courseDisplay.length > 0 &&
				<div className="flex flex-col text-xl ">
					{courseDisplay.map((course) => {
						{console.log("RGP : ",course.rgp_course_id )}


						const divLevel1_className = clsx(
							'rounded-none border-0  border-t-1 border-b-1 md:border-r-1 md:border-l-1 border-solid py-1  flex flex-row-reverse ',
							{

								// 'border-black border-solid': rgp_course_id_before == course.rgp_course_id,
								'mt-4': course.displayTrip.firstOfRgp,
								'md:rounded-t-lg': course.displayTrip.firstOfRgp,
								'md:rounded-b-lg': course.displayTrip.lastOfRgp,
								'border-t-0': !course.displayTrip.firstOfRgp
							}
						)
						const colorCourse = clsx(
							{
								'bg-green-200': course.displayTrip.courseType == CourseType.AFaire,
								'border-green-500': course.displayTrip.courseType == CourseType.AFaire,
								'bg-blue-200': course.displayTrip.courseType == CourseType.Cloture,
								'border-blue-500': course.displayTrip.courseType == CourseType.Cloture,
								'bg-gray-200': course.displayTrip.courseType == CourseType.Annule,
								'border-gray-500': course.displayTrip.courseType == CourseType.Annule,
								'bg-yellow-200': course.displayTrip.courseType == CourseType.Proposition,
								'border-yellow-500': course.displayTrip.courseType == CourseType.Proposition,
							}
						)

						// positionnement du scroll en fonction de l'heure
						let idTag = ""
						const heureTakeOver = course.first_takeover_date.substr(11, 5);
						if (heureCourante < heureTakeOver && !trouve) {
							idTag = '"ancre"';
							trouve = true;
						}

						return (
							<>
								<div className={twMerge(divLevel1_className, colorCourse, "")} onClick={() => { clickRegroupement(course.rgp_course_id, course.course_id, course.course_status, course.taxi_name, course.masque) }} key={course.course_id} id={idTag}  >
									{clickable && course.displayTrip.courseType !== CourseType.Proposition && <div className="flex flex-col justify-center vbasis-[10vw] mx-1.5 ">
										<Button className={twMerge(colorCourse, " text-gray-600 rounded-xl border-0 stroke-green-500")}>
											{/* {course.displayTrip.btnMessage} */}
											<ExternalLink />
										</Button>
									</div>}
									<div className="grow">
										<div className="flex">
											<div className="w-20 text-center font-bold">{course.first_takeover_date.substring(11, 16)}</div>
											<div className="col-span-4">{course.first_takeover_arret_libelle}</div>
										</div>
										<div className="flex">
											<div className="w-20 text-center text-gray-700">{course.last_dropoff_date.substring(11, 16)}</div>
											<div className="text-gray-700">{course.last_dropoff_arret_libelle}</div>
										</div>
										<div className="flex flex-row-reverse text-base h-5 text-gray-500">
											<div className="w-20 text-center">
											{course.course_id}
												<Users strokeWidth={1} className="mr-2 inline mx-auto" size={17} />
												{course.client_nb}
											</div>
											<div className="">
												{course.rgp_course_id}
												{course.client_nom} 

											</div>
										</div>

									</div>
								</div>
								{clickable && course.displayTrip.courseType == CourseType.Proposition && course.displayTrip.lastOfRgp &&
									<div className="flex justify-center border-t-bg-yellow-200" onClick={() => { clickRegroupement(course.rgp_course_id, course.course_id, course.course_status, course.taxi_name) }}>
										<Button className="hover:bg-yellow-300 bg-yellow-200 border-yellow-500 text-yellow-900 border rounded-t-none border-t-yellow-200" >
											Accepter ?
											<ExternalLink />
										</Button>
									</div>
								}
							</>
						);
					})}

				</div>
			}
			{
				open && <CourseAction open={open} setOpen={setOpen} courses={courses} coursesSel={coursesToDialog} rgpId={rgpId} tripId={tripId} filtre={filtreCourse} />
			}
		</>
	)
}


// if (courses === null || courses === undefined) return (<></>)
// 	return (
// 		<>
// 			{courses.length > 0 &&
// 				<div className="flex flex-col text-xl ">
// 					{courses.map((course) => {
// 						isCourseToDo = false
// 						isBtnVu = false
// 						let typeAction = ActionType.Inconnue

// 						// console.log(filtreCourse);
// 						switch (filtreCourse) {
// 							case Filtre_course_url_query.A_faire:
// 								if (course.course_status == "1" || (course.course_status == "0" && course.masque == "0"))
// 									isCourseToDo = true;
// 								isBtnVu = course.course_status == "0" && course.masque == "0" ? true : false
// 								break;
// 							case Filtre_course_url_query.Proposition:
// 								if (course.course_status == "1" && (course.taxi_name == "" || course.taxi_name == null))
// 									isCourseToDo = true;
// 								break;
// 							case Filtre_course_url_query.Annulee:
// 								if (course.course_status == "0")
// 									isCourseToDo = true;
// 								break;
// 							case Filtre_course_url_query.Cloturee:
// 								if (course.course_status == "2")
// 									isCourseToDo = true;
// 								break;
// 							case Filtre_course_url_query.Toute:
// 								isCourseToDo = true;
// 								break;
// 							default:
// 								break;
// 						}

// 						if (isCourseToDo) {
// 							const divLevel1_className = clsx(
// 								'border border-black border-solid py-1',
// 								{
// 									'bg-green-200': course.course_status == Course_statut.A_faire,
// 									'border-green-500': course.course_status == Course_statut.A_faire,
// 									'bg-blue-200': course.course_status == Course_statut.Cloturee,
// 									'border-blue-500': course.course_status == Course_statut.Cloturee,
// 									'bg-gray-200': course.course_status == Course_statut.Annule,
// 									'border-gray-500': course.course_status == Course_statut.Annule,
// 									'bg-yellow-200': course.course_status == Course_statut.A_faire && (course.taxi_name == "" || course.taxi_name == null),
// 									'border-yellow-500': course.course_status == Course_statut.A_faire && (course.taxi_name == "" || course.taxi_name == null),
// 									// 'border-black border-solid': rgp_course_id_before == course.rgp_course_id,
// 									'mt-4': rgp_course_id_before != course.rgp_course_id,
// 								}
// 							);
// 							// 'mt-4': rgp_course_id_before != course.rgp_course_id,
// 							rgp_course_id_before = course.rgp_course_id;
// 							// cpt++;

// 							// positionnement du scroll en fonction de l'heure
// 							let idTag = ""
// 							const heureTakeOver = course.first_takeover_date.substr(11, 5);
// 							if (heureCourante < heureTakeOver && !trouve) {
// 								idTag = '"ancre"';
// 								trouve = true;
// 							}

// 							return (
// 								<div className={twMerge(divLevel1_className, " flex flex-row-reverse rounded-lg")} onClick={() => { clickRegroupement(course.rgp_course_id, course.course_id, course.course_status, course.taxi_name) }} key={course.course_id} id={idTag}  >



// 									<div className="flex basis-[10vw]">
// 										<Button className="">COUCOU</Button>

// 									</div>
// 									<div className="grow">
// 										<div className="flex">
// 											<div className="w-20 text-center font-bold">{course.first_takeover_date.substring(11, 16)}</div>
// 											<div className="col-span-4">{course.first_takeover_arret_libelle}</div>
// 										</div>
// 										<div className="flex">
// 											<div className="w-20 text-center text-gray-700">{course.last_dropoff_date.substring(11, 16)}</div>
// 											<div className="text-gray-700">{course.last_dropoff_arret_libelle}</div>
// 										</div>
// 										<div className="flex flex-row-reverse text-base h-5 text-gray-500">
// 											<div className="w-20 text-center">
// 												<Users strokeWidth={1} className="mr-2 inline mx-auto" size={17} />
// 												{course.client_nb}
// 											</div>
// 											<div className="">
// 												{course.client_nom}
// 											</div>
// 											{/* <div className="">
// 											 : {course.rgp_course_id}
// 											 </div>
// 											 <div className="">
// 											 : {course.course_id}
// 											 </div> */}
// 										</div>
// 										{isBtnVu &&
// 											<div className="flex justify-center">
// 												<Button onClick={() => clickVu(course.course_id)} className="" variant="secondary">Marquer comme vu</Button>
// 											</div>}
// 									</div>
// 								</div>
// 							);
// 						}
// 					})}
// 				</div>
// 			}
// 			{courses.length == 0 && <div>Pas de course pour le moment</div>}
// 			{
// 				open && <CourseAction open={open} setOpen={setOpen} courses={courses} coursesSel={coursesToDialog} rgpId={rgpId} tripId={tripId} filtre={filtreCourse} />
// 			}
// 		</>
// 	)