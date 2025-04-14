"use client";

import { usePathname, useRouter } from "next/navigation"
import { useEffect,useRef } from 'react'
import { tokenName } from "@/lib/affinis"

export default function LayoutRoute({ children }: { children: React.ReactNode }) {
	const router = useRouter()
	const pahtName = usePathname()
	const pathExcept = ["/test", "/aide"]
	const dejaFait = useRef(false)


	if (!dejaFait.current) {
		dejaFait.current = true

		const channeConnect = new BroadcastChannel('sw-to-deconnect');
		channeConnect.addEventListener('message', event => {
			console.info('Received PROVIDER sw-to-deconnect', event.data,event?.data?.deconnect);
			if (event?.data?.deconnect && pahtName !== "/identification"){
				console.log("redirect /identification")
				router.push('/identification')
			} 
		});
	}

	useEffect(() => {
		if (!pathExcept.includes(pahtName)) {
			const token: string | null = localStorage.getItem(tokenName)
			if (token === null && pahtName !== "/identification" && pahtName !== "/installation") {
				console.log("Vers identification, car aucun token")
				return router.push("/identification")
			}
		}
	})
	return (
		<>
			{children}
		</>
	)
}