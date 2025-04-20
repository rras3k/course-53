"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"

export default function Update({ children }: { children: React.ReactNode }) {

    const [showButtonUpdate, setShowButtonUpdate] = useState(false);



    useEffect(() => {
		if ('serviceWorker' in navigator) {
			//window.addEventListener('load', () => {
			navigator.serviceWorker.register('/sw.js')
				.then(reg => {
					console.log('SW enregistré:', reg.scope);
					reg.onupdatefound = () => {
						const installingWorker = reg.installing;
						if (installingWorker) {
							installingWorker.onstatechange = () => {
								if (installingWorker.state === 'installed') {
									if (navigator.serviceWorker.controller) {
										window.location.reload();
									}
								}
							};
						}
					};
				})
				.catch(err => console.error('SW erreur:', err));
			//});
		}

	},)



    return (
        <>
        {/* {children} */}
            {showButtonUpdate && <Button className="">Cliquez sur le boutton pour faire la miose à jour</Button>}
            {showButtonUpdate &&  {children}}
        </>
    )

}