"use client"

import { createContext, Dispatch, SetStateAction, useContext, useRef, useState } from "react"


type ContextType = {
    hasProposition: boolean
    setHasProposition: Dispatch<SetStateAction<boolean>>,
};

// Création du contexte
export const HasPropositionContext = createContext<ContextType>({ hasProposition: false, setHasProposition: () => { } })

// Installation du contexte
export default function HasPropositionProvider({ children }: { children: React.ReactNode }) {
    const dejaFait = useRef(false)
    const [hasProposition, setHasProposition] = useState<boolean>(false)
    const valueHasProposition = {
        hasProposition: hasProposition,
        setHasProposition: setHasProposition
    }

    if (!dejaFait.current) {
        dejaFait.current = true
        const channelHasNotification = new BroadcastChannel('sw-hasNotification');
        channelHasNotification.addEventListener('message', event => {
            console.log('Received PROVIDER sw-hasNotification', event.data.hasProposition);
            setHasProposition(event.data.hasProposition);
        });
    }


    return <HasPropositionContext.Provider value={valueHasProposition}> {children} </HasPropositionContext.Provider>
}

// Consommation du contexte
export const useHasPropositionContext = () => useContext(HasPropositionContext)