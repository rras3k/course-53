"use client";

import { usePathname, useRouter } from "next/navigation"
import { getPWADisplayMode, isPwaInstalled } from "@/lib/rrasb2k/app"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";


export default function PwaInstall({ children }: { children: React.ReactNode }) {
  const [isOnInstallation, setIsOnInstallation] = useState(false)
  const [installClick, setinstallClick] = useState(false);
  const [allreadyInstall, setallreadyInstall] = useState(true);
  const [deferredEvent, setDeferredEvent] = useState();
  // const [deferredEvent, setDeferredEvent] = useState<typeof Event>();
  const router = useRouter()
  const pahtName = usePathname()
  // let deferredEvent: typeof Event;


  const installAppClick = () => {
    console.log("installAppClick deferredEvent", deferredEvent)
    if (deferredEvent) {
      deferredEvent.prompt();
      setinstallClick(true)
    }
    else {
      console.log(" deferredEvent undefined")
    }
  }

  useEffect(() => {
    console.log("iciiiiiiiiii")
    if (process.env.NEXT_PUBLIC_APP_ONLY === "true" && !isPwaInstalled()) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // prevent the browser from displaying the default install dialog
        //e.preventDefault()

        // Stash the event so it can be triggered later when the user clicks the button
        // deferredEvent = e
        setDeferredEvent(e)
        console.log("useffect deferredEvent", deferredEvent)

        setallreadyInstall(deferredEvent === undefined)
        setIsOnInstallation(true)
      })
    }
    else {
      setIsOnInstallation(false)
    }
  }, [])

  return (
    <>
      {isOnInstallation &&
        <>
          {<Button onClick={installAppClick} >Installation de l&apos;application Course 53 </Button>}
          {/* {!installClick && <Button onClick={installAppClick} className={allreadyInstall ? " hidden" : ""}>Installation de l&apos;application Course 53 </Button>} */}
          {/* {installClick && <Button onClick={() => { router.push("/") }}>Continuer...</Button>} */}
          {/* <div className={allreadyInstall ? " " : " hidden"}>Lancer Course 53 depuis la liste de vos applications</div> */}
        </>
      }
      {!isOnInstallation &&
        children
      }

      {/* {isOnInstallation ? (
        <>
          {installClick && <Button onClick={() => { router.push("/identification") }}>Continuer...</Button>}
          {!installClick && <Button onClick={installAppClick} className={allreadyInstall ? " hidden" : ""}>Installation de l&apos;application Course 53 </Button>}
          <div className={allreadyInstall ? " " : " hidden"}>Lancer Course 53 depuis la liste de vos applications</div>
        </>
      ) : 
        ({children})
      } */}
    </>
  )
}


// isIOS =
//       navigator.userAgent.includes("iPhone") ||
//       navigator.userAgent.includes("iPad") ||
//       (navigator.userAgent.includes("Macintosh") &&
//         typeof navigator.maxTouchPoints === "number" &&
//         navigator.maxTouchPoints > 2);