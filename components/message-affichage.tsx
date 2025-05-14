"use client"

import { Filtre_course_url_query, Course_statut, tokenName } from "@/lib/affinis";
import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";
import CourseAction from "./course-action";
import { useState } from 'react';
import { Users } from 'lucide-react';
import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { setMessagesIntoDb } from "@/lib/artaxi";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation"


export default function MessageAffichage({ clickable, messages }) {

	const router = useRouter();

	console.log("MESSAGE AFDFICHAGE COMPONENT", messages)
	const [open, setOpen] = useState(false);

	function clickValiderMessages() {
		setOpen(true)
	}

	async function clickMessagesLu() {
		if (clickable) {

			console.log("click valide Messages lus")
			const listMessages = JSON.stringify(getListMessages(messages)) 
			console.log("click valide Messages lus",listMessages)
			const reponse = await fetch(
				process.env.NEXT_PUBLIC_API_URL + '/taxi/lecture/confirm'
				, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem(tokenName)}`,
						"Content-Type": "application/json",
					},
					method: 'POST',
					body: listMessages
				}
			)
			const retour = await reponse.json();
			if (retour?.retour) {
				// reponse ok. on supprimes les messages dans DB
				setMessagesIntoDb([])
				// enlever la boite de dialogue
				setOpen(false)
				// retopurner aux courses
				router.push('/taxi/courses')

			}
			else {
				//setMessage("Erreur dans la validatin des messages lus")
			}
		}

	}

	function getListMessages(messages:[]):[]{
		let ret=[]
		messages.map((message)=>{
			ret.push(message.id)
		})
		return ret
	}

	console.log("AFFICHAGE MESSAGES", messages)
	if (messages === null || messages === undefined) return (<>Pas de messages</>)

	return (
		<>
			<div className="flex flex-col text-xl">
				{messages.map((message:[]) => {
					return (
						<div key={message.id} className="bg-blue-100 border border-gray-400 py-2 px-2" >
							{message.message}
						</div>)
				})}

				{clickable &&
					<div onClick={clickValiderMessages} className="my-5  mx-auto ">
						<Button>
							Valider les messages vus
						</Button>
					</div>
				}
			</div>

			{
				open &&
				<>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Valider les messages</DialogTitle>
							</DialogHeader>
							<DialogFooter >
								<div className="flex flex-co justify-center ">
									<Button className="mr-8 " variant="secondary" onClick={() => { setOpen(false) }}>Fermer</Button>
									<Button className="" onClick={() => { clickMessagesLu() }}>Ok</Button>
								</div>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</>
			}
		</>
	)
}
