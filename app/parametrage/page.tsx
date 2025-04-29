"use client"

// import ChoixLuminosite from "@/components/choix-luminosite";
import { Encart, EncartLabel, EncartContent } from "@/components/rrasb2k/encart";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"
import { set, get } from 'idb-keyval';
import { useEffect, useState } from "react";
import { identClear } from "@/lib/artaxi";



const Parametrage = () => {
	const [canDisplayNotifications, setcanDisplayNotifications] = useState(false);
	const [displayNotifications, setdisplayNotifications] = useState(false);

	useEffect(() => {
		if (("Notification" in window)) {
			setcanDisplayNotifications(true)
		}
	}, [])
	useEffect(() => {
		get("stateDisplayNotification")
			.then((value) => {
				setdisplayNotifications(value === true)
			})
			.catch((e) => {
				setdisplayNotifications(false)
				console.log(e)
			})
	}, [])

	function SwitchDisplayNotification(state: boolean) {
		setdisplayNotifications(state)
		set("stateDisplayNotification", state)
	}

	function maj() {

	
		identClear()
	}

	return (
		<>
			<div className="flex flex-1 flex-col gap-4 px-4 py-10 items-center ">
				<div className="flex flex-col mx-auto w-full " >
					{/* <Encart className="">
						<EncartLabel>
							Mode d&aposéclairage
						</EncartLabel>
						<EncartContent>
							<ChoixLuminosite />
						</EncartContent>
					</Encart> */}
					{!canDisplayNotifications && <Encart>
						<EncartLabel>
							Notification non supporté par votre navigateur
						</EncartLabel>
					</Encart>}
					{canDisplayNotifications && <Encart className="">
						<EncartLabel>
							Afficher des notfications
						</EncartLabel>
						<EncartContent>
							<Switch id="notification" checked={displayNotifications}
								onCheckedChange={SwitchDisplayNotification} />
						</EncartContent>
					</Encart>}
					{/* <Encart>
						<EncartLabel>
							Mise à jour
						</EncartLabel>
						<Button onClick={maj}>Mertte à jour</Button>

					</Encart> */}
				</div>
			</div >
		</>
	)
}
export default Parametrage;




// self.addEventListener('pushsubscriptionchange', function () {
// 	// remove the entry from DB
// });