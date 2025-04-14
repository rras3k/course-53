"use client"

import { createContext, Dispatch, SetStateAction, useContext, useRef, useState } from "react"

type ContextTypeAllCourses = {
    courses: object[] | undefined
    setCourses: Dispatch<SetStateAction<object[] | undefined>>,
};

// Création du contexte
export const CourseAllTaxiContext = createContext<ContextTypeAllCourses>({ courses: [], setCourses: () => { } })

// Installation du contexte
export default function CourseAllTaxiProvider({ children }: { children: React.ReactNode }) {
    console.log("=============================================================== CourseAllTaxiProvider =================================")
    const dejaFait = useRef(false)
    const [courses, setCourses] = useState<[]>()
    const valueCourses = {
        courses: courses,
        setCourses: setCourses
    }

    if (!dejaFait.current) {
        dejaFait.current = true

        const channelAllCourseData = new BroadcastChannel('sw-all-courses-data');
        channelAllCourseData.addEventListener('message', event => {
            console.info('Received PROVIDER sw-all-courses-data', event.data);
            setCourses(event.data);
        });

        
    }


    return <CourseAllTaxiContext.Provider value={valueCourses}> {children} </CourseAllTaxiContext.Provider>
}

// Consommation du contexte
export const useAllCourseTaxiContext = () => useContext(CourseAllTaxiContext)