"use client"

import { identGetProfilId } from "@/lib/artaxi"
import {ProfilEnum} from "@/lib/affinis"
import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function Home() {
    const router = useRouter();

    useEffect(() => {

        router.push('/taxi/courses')
        // const profilId: string | null = identGetProfilId()

        // if (profilId) {
        //     switch (profilId) {
        //         case ProfilEnum.Taxi:
        //             router.push('/taxi/courses')
        //             break;
        //         case ProfilEnum.Artaxi:
        //             router.push('/artaxi/courses')
        //             break;
        //         case ProfilEnum.Admin:
        //             router.push('/admin/courses')
        //             break;
        //         case ProfilEnum.Centrale:
        //             router.push('/centrale/courses')
        //             break;
        //         default:
        //             break;
        //     }
        // }

    })

    return (
        <>
            <div>Chargement de la page...</div>
        </>
    )
}