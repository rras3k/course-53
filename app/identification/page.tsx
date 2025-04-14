"use client"


// import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { identSet, identClear } from "@/lib/artaxi";
import { useState } from 'react';
import { useRouter } from "next/navigation"
// import { set } from 'idb-keyval';
import { getInputStringValue } from "@/lib/rrasb2k/domUtils"


// const setUrlApiDb = () => {
// 	set("urlApi", process.env.NEXT_PUBLIC_API_URL)
// }

export default function Identification() {

	// identClear() // suprime toutes données dans les caches et indexDb de l'identification
	
	//setUrlApiDb() // Positionne l'url des appels API dans indexDb pour le webworker

	// const dejaFait = useRef(false)

	const router = useRouter();
	const [isErrorMsg, setIsErrorMsg] = useState(false);
	// const [label, setLabel] = useState(1);

	// if (!dejaFait.current) {
	// 	dejaFait.current = true

	// 	const channeConnect = new BroadcastChannel('sw-to-deconnect');
	// 	channeConnect.addEventListener('message', event => {
	// 		console.info('Received PROVIDER sw-to-deconnect', event.data);
	// 		if (event?.data?.connect) router.push('/identification')
	// 	});
	// }


	const submit = () => {
		const login = getInputStringValue("login")
		const mdp = getInputStringValue("mdp")
		if (login && mdp) {
			askIdent(login, mdp)
				.then((reponse) => {
					if (reponse === true) {
						console.log("identification ok, on va vers /")
						router.push('/')
					}
					console.log("reponse", reponse)
				})
		}
		else {
			setIsErrorMsg(true)
		}
	}

	async function askIdent(login: string, mdp: string): Promise<boolean> {
		try {
			console.log("askIdent ", login, mdp,process.env.NEXT_PUBLIC_API_URL)
			console.log("process.env ",process.env.NEXT_PUBLIC_DELAI_API_COURSE)
			const data = await fetch(
				process.env.NEXT_PUBLIC_API_URL + '/identification'
				, {
					method: 'POST',
					body: '{"login":"' + login + '", "password":"' + mdp + '", "version_app_mobile":"1.0.0"}'
				}
			)
			const dj = await data.json();
			if (dj?.retour) {
				console.log("identification ok askident")
				// stocke les data de ident
				identSet({ token: dj.data.jwt, profilId: dj.data.profil, nom: dj.data.nom, prenom: dj.data.prenom })
				return true;
			}
			else {
				console.log("identification pas ok")
				setIsErrorMsg(true)
			}
		} catch (e) {
			console.log("identification pas ok avec erreur", e)
		}
		return false;
	}


	// useEffect(() => {

	// },)

	return (
		<>
			<Card className="w-[340px] mx-auto my-10">
				<CardHeader>
					<CardTitle>Identification Course 53</CardTitle>
					<CardDescription>Saisir vos identifiants</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Login</Label>
								<Input id="login" type="text" placeholder="Saisissez votre login" defaultValue="artaxi" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="mdp">Mot de passe</Label>
								<Input id="mdp" placeholder="Saisissez votre mot de passe" defaultValue="6808" />
							</div>
						</div>
					</form>
					{isErrorMsg &&
						<div className="text-red-700 font-bold my-3">
							Saisie incorrect, veuillez recommencer
						</div>
					}
				</CardContent>
				<CardFooter className="flex justify-between">
					{/* <Button variant="outline">Cancel</Button> */}
					<Button onClick={submit} className="bg-primary w-20 mx-auto">Ok</Button>
				</CardFooter>
			</Card>
		</>
	)
}
