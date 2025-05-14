"use client";

import { setCoursesIntoDb,setMessagesIntoDb } from "@/lib/artaxi";
import { useRef } from "react";


export default function Flow({ children }: { children: React.ReactNode }) {
    const dejaFait = useRef(false)

    if (!dejaFait.current) {
        dejaFait.current = true

        const channelFlowFromServer = new BroadcastChannel('sw-flow-server-data');
        const channelFlowJustReceived = new BroadcastChannel('flow-juste-received');
        channelFlowFromServer.addEventListener('message', event => {
            console.info('(FLOW) Received  sw-flow-server-data', event.data);
            setCoursesIntoDb(event.data.flow.courses)
            setMessagesIntoDb(event.data.flow.messages)
            channelFlowJustReceived.postMessage({"ok":1})
        });
    }

    return (
        <>
            {children}
        </>
    )
}
