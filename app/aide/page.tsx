"use client"

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function Aide() {
	const router = useRouter()
	function btnClick(){
		// document.location.replace("/test")

		router.push("/test")
	}
	return (
		<>
			<Accordion type="single" collapsible className="w-full p-3">
				<AccordionItem value="item-1" className="text-md">
					<AccordionTrigger className="text-lg text-sky-900">Installation de `l` application</AccordionTrigger>
					<AccordionContent className="text-lg">
						Yes. It adheres to the WAI-ARIA design pattern.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger className="text-lg text-sky-900">Filtrer les courses</AccordionTrigger>
					<AccordionContent className="text-lg">
						Yes. It comes with default styles that matches the other
						components&apos; aesthetic.
					</AccordionContent>
				</AccordionItem>

			</Accordion>
			<Button onClick={btnClick}>nav</Button>
			<Link href="/test">link</Link>
		</>
	)
}


