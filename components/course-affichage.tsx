"use client"

import { Filtre_course_url_query, Course_statut } from "@/lib/affinis";
import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import CourseAction from "./course-action";
import { useState } from 'react';
import { Users } from 'lucide-react';
import React from 'react'

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

export default function CourseAffichage({ filtreCourse, clickable, courses }) {

	const [open, setOpen] = useState(false);
	const [coursesToDialog, setCoursesToDialog] = useState<[]>();
	const [rgpId, setRgpId] = useState<string>("");
	const [tripId, setTripId] = useState<string>("");

	const clickRegroupement = (rgpCourseId: string, tripId: string, status:string, taxi_name:string) => {
		if (clickable) {
			if (status == "1" && (taxi_name == "" || taxi_name == null)) {
				// proposition, donc on envoie le regroupement
				const dateSel: [] = getCoursesForRgpId(courses, rgpCourseId)
				setCoursesToDialog(dateSel)
				setRgpId(rgpCourseId)
				// setTripId(tripId)
				setOpen(true);
			}
			else if(status == "1"){
				// demande de cloture
				const dateSel: [] = getCoursesForTripId(courses, tripId)
				setCoursesToDialog(dateSel)
				// setRgpId(rgpCourseId)
				setTripId(tripId)
				setOpen(true);
			}
		}
	}

	let rgp_course_id_before: string = "";
	let isCourseToDo: boolean;
	let trouve = false
	const d = new Date();
	const heureCourante = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	// console.log("Affichage des courses ", filtreCourse, datas)
	if (courses === null || courses === undefined) return (<></>)

	return (
		<>
			{
				<div className="flex flex-col text-xl">
					{courses.map((course) => {
						isCourseToDo = false;
						// console.log(filtreCourse);
						switch (filtreCourse) {
							case Filtre_course_url_query.A_faire:
								if (course.course_status == "1")
									isCourseToDo = true;
								break;
							case Filtre_course_url_query.Proposition:
								if (course.course_status == "1" && (course.taxi_name == "" || course.taxi_name == null))
									isCourseToDo = true;
								break;
							case Filtre_course_url_query.Annulee:
								if (course.course_status == "0")
									isCourseToDo = true;
								break;
							case Filtre_course_url_query.Cloturee:
								if (course.course_status == "2")
									isCourseToDo = true;
								break;
							case Filtre_course_url_query.Toute:
								isCourseToDo = true;
								break;
							default:
								break;
						}

						if (isCourseToDo) {
							const divLevel1_className = clsx(
								'border-t border-b border-black border-solid py-1',
								{
									'bg-green-200': course.course_status == Course_statut.A_faire,
									'bg-blue-200': course.course_status == Course_statut.Cloturee,
									'bg-gray-200': course.course_status == Course_statut.Annule,
									'bg-yellow-200': course.course_status == Course_statut.A_faire && (course.taxi_name == "" || course.taxi_name == null),
									'mt-4': rgp_course_id_before != course.rgp_course_id,
									'border-t-0 border-black border-solid': rgp_course_id_before == course.rgp_course_id,
								}
							);
							rgp_course_id_before = course.rgp_course_id;
							// cpt++;

							// positionnement du scroll en fonction de l'heure
							let idTag = ""
							const heureTakeOver = course.first_takeover_date.substr(11, 5);
							if (heureCourante < heureTakeOver && !trouve) {
								idTag = '"ancre"';
								trouve = true;
							}

							return (
								<div onClick={() => { clickRegroupement(course.rgp_course_id, course.course_id,course.course_status,course.taxi_name) }} key={course.course_id} id={idTag} className={twMerge(divLevel1_className)} >
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
											<Users strokeWidth={1} className="mr-2 inline mx-auto" size={17} />
											{course.client_nb}
										</div>
										<div className="">
											{course.client_nom}
										</div>
										<div className="">
											 : {course.rgp_course_id}
										</div>
										<div className="">
											 : {course.course_id}
										</div>
									</div>
								</div>
							);
						}
					})}
				</div>
			}
			{
				open && <CourseAction open={open} setOpen={setOpen} coursesSel={coursesToDialog} rgpId={rgpId} tripId={tripId} filtre={filtreCourse} />
			}
		</>
	)
}
