"use client"

import { createContext, Dispatch, SetStateAction, useContext, useRef, useState } from "react"
import { setCoursesIntoDb, setMessagesIntoDb, dcHasProposition } from '@/lib/artaxi'


type FlowData = {
    flows: [],
}
type ContextTypeFlows = {
    flows: FlowData | undefined
    setFlows: Dispatch<SetStateAction<object[] | undefined>>,
};

// Création du contexte
export const FlowTaxiContext = createContext<ContextTypeFlows>({ flows: [], setFlows: () => { } })

// Installation du contexte
export default function FlowTaxiProvider({ children }: { children: React.ReactNode }) {
    console.log("=============================================================== CourseTaxiProvider =================================")
    const dejaFait = useRef(false)
    const [flows, setFlows] = useState<[]>()
    const valueFlows = {
        flows: flows,
        setFlows: setFlows
    }




    if (!dejaFait.current) {
        dejaFait.current = true

        const channelFlowFromServer = new BroadcastChannel('sw-flow-server-data')
        channelFlowFromServer.addEventListener('message', event => {
            console.info('(FLOW) Received  sw-flow-server-data', event.data)
            if (Array.isArray(event.data.flow.courses)) {
                // setCoursesIntoDb(event.data.flow.courses)
                // Post d'un boolean indiquant si detection de proposition lors de la derniere reception de courses pour un taxi
                // const channelHasNotification = new BroadcastChannel('sw-hasNotification');
                // if (dcHasProposition(data)) {
                //     console.log("show notification")
                //     sendNotification("Nouvelles propositions de course", "Veuillez valider les courses à prendre");
                //     channelHasNotification.postMessage({ hasProposition: true, date: constdateNow })
                // }
                // else {
                //     channelHasNotification.postMessage({ hasProposition: false, date: constdateNow })
                // }

                // if (Array.isArray(event.data.flow.messages))
                //     setMessagesIntoDb(event.data.flow.messages)
                setFlows(event.data)
            }
        })
    }
    return <FlowTaxiContext.Provider value={valueFlows}> {children} </FlowTaxiContext.Provider>
}

// Consommation du contexte
export const useFlowTaxiContext = () => useContext(FlowTaxiContext)