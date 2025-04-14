"use client"

import { createContext, Dispatch, SetStateAction, useContext, useRef, useState } from "react"

type ContextTypeMessages = {
    Messages: object[] | undefined
    setMessages: Dispatch<SetStateAction<object[] | undefined>>,
};

// Création du contexte
export const MessageTaxiContext = createContext<ContextTypeMessages>({ Messages: [], setMessages: () => { } })

// Installation du contexte
export default function MessageTaxiProvider({ children }: { children: React.ReactNode }) {
    console.log("=============================================================== MessageTaxiProvider =================================")
    const dejaFait = useRef(false)
    const [messages, setMessages] = useState<[]>()
    const valueMessages = {
        Messages: messages,
        setMessages: setMessages
    }

    if (!dejaFait.current) {
        dejaFait.current = true

        const channeMessages = new BroadcastChannel('sw-messages-data');
        channeMessages.addEventListener('message', event => {
            console.info('Received PROVIDER sw-messages-data', event.data);
            setMessages(event.data);
        });
    }
    return <MessageTaxiContext.Provider value={valueMessages}> {children} </MessageTaxiContext.Provider>
}

// Consommation du contexte
export const useMessageTaxiContext = () => useContext(MessageTaxiContext)