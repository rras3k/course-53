"use client"

import { createContext, Dispatch, SetStateAction, useContext, useRef, useState } from "react"
import { getCoursesFromDb,setCoursesIntoDb,setMessagesIntoDb } from '@/lib/artaxi'


type CourseData = {
    courses:[],
}
type ContextTypeCourses = {
    courses: CourseData | undefined
    // courses: object[] 
    // courses: object[] | undefined
    setCourses: Dispatch<SetStateAction<object[] | undefined>>,
};

// Création du contexte
export const CourseTaxiContext = createContext<ContextTypeCourses>({ courses: [], setCourses: () => { } })
// export const CourseTaxiContext = createContext<ContextTypeCourses>({ courses: [], setCourses: () => { } })

// Installation du contexte
export default function CourseTaxiProvider({ children }: { children: React.ReactNode }) {
    console.log("=============================================================== CourseTaxiProvider =================================")
    const dejaFait = useRef(false)
    const [courses, setCourses] = useState<[]>()
    const valueCourses = {
        courses: courses,
        setCourses: setCourses
    }

    if (!dejaFait.current) {
        dejaFait.current = true

        // const channeCourses = new BroadcastChannel('sw-courses-data');
        // channeCourses.addEventListener('message', event => {
        //     console.info('Received PROVIDER sw-courses-data', event.data);
        //     setCourses(event.data);
        // });

        const channelFlowFromServer = new BroadcastChannel('sw-flow-server-data');
        channelFlowFromServer.addEventListener('message', event => {
            console.info('(FLOW) Received  sw-flow-server-data', event.data);
            setCoursesIntoDb(event.data.flow.courses)
            setMessagesIntoDb(event.data.flow.messages)
            setCourses(event.data);
        });


    }
    return <CourseTaxiContext.Provider value={valueCourses}> {children} </CourseTaxiContext.Provider>
}

// Consommation du contexte
export const useCourseTaxiContext = () => useContext(CourseTaxiContext)