"use client"

// import { loadExampleListAll } from "@/lib/artaxi";
import { Filtre_course_url_query, Course_statut } from "@/lib/affinis";
// import { COURSE_STATUT_ANNULEE, COURSE_STATUT_CLOTUREE, COURSE_STATUT_A_FAIRE } from "@/lib/artaxi";
// import { COURSE_FILTRE_A_FAIRE, COURSE_FILTRE_PROPOSITION, COURSE_FILTRE_CLOTUREE, COURSE_FILTRE_ANNULEE, COURSE_FILTRE_TOUTE } from "@/lib/artaxi";
import { clsx } from 'clsx';
// import { type ClassValue, clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import CourseAction from "./course-action";
import { useState } from 'react';
import { Users } from 'lucide-react';
// import { set, get, del } from 'idb-keyval';
import React from 'react'

export default function AllCourseAffichage({ filtreCourse, datas }) {
	const [open, setOpen] = useState(false);
	console.log("course-affichage !!!!!")
	const clickRegroupement = () => {
		setOpen(true);
	}
	let rgp_course_id_before: string = "";
	let isCourseToDo: boolean;
	let trouve = false
	const d = new Date();
	const heureCourante = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
	console.log("Affichage des courses ", filtreCourse, datas)
	if (datas === null) return (<></>)
	return (
		<>
			{
				<div className="flex flex-col text-xl">
					{datas.data.courses.map((course) => {
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
						isCourseToDo = true;

						if (isCourseToDo) {
							const divLevel1_className = clsx(
								'border-t border-b border-black border-solid py-1 ',
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
								<div onClick={clickRegroupement} key={course.course_id} id={idTag} className={twMerge(divLevel1_className)} >
									<div className="flex">
										<div className="w-20 text-center font-bold">{course.first_takeover_date.substring(11, 16)}</div>
										<div className="col-span-4">{course.first_takeover_arret_libelle}</div>
									</div>
									<div className="flex">
										<div className="w-20 text-center text-gray-700">{course.last_dropoff_date.substring(11, 16)}</div>
										<div className="text-gray-700">{course.last_dropoff_arret_libelle}</div>
									</div>
									<div className="flex flex-row-reverse text-base h-5 text-gray-500">
										<div className="w-40 text-center font-bold">{course.course_id}</div>
										<div className="w-40 text-center font-bold">{course.rgp_course_id}</div>
										<div className="w-20 text-center font-bold">{course.taxi_name}</div>
										<div className="w-20 text-center">
											<Users strokeWidth={1} className="mr-2 inline mx-auto" size={17} />
											{course.client_nb}
										</div>
										<div className="">
											{course.client_nom}
										</div>
									</div>

									{/* 									
									<div className="">
										{course.course_id}
									</div>
									<div className=" border border-solid border-black">
										{course.rgp_course_id}
									</div>
									<div className="">
										{course.first_takeover_date.substring(11, 16)}
									</div>
									<div className="">
										{course.first_takeover_arret_libelle}
									</div>
									<div className="">
										{course.last_dropoff_date.substring(11, 16)}
									</div>
									<div className="">
										{course.last_dropoff_arret_libelle}
									</div>
									<div className="">
										{course.client_nom}
									</div>
									<div className="">
										{course.client_nb}
									</div>
									<div className="">
										{course.taxi_name}
									</div>
 */}

									{/* 
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
									</div> */}
								</div>
							);
						}
					})}
				</div>
			}
			{
				open && <CourseAction open={open} setOpen={setOpen} />
			}
		</>
	)
}
