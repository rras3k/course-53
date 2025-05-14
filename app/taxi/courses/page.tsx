"use client"

import CourseAffichage from '@/components/course-affichage'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { getFiltreCourse } from '@/lib/affinis'
import { getCoursesFromDb } from '@/lib/artaxi'
import { useFlowTaxiContext } from '@/providers/flow-taxi-provider'
import MessageAffichage from '@/components/message-affichage'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'



export enum TypeDisplay {
   Wait = "1",
   Courses = "2",
   Messages = "3",
}

export default function Courses() {

   const [whatDiplay, setWhatDisplay] = useState<TypeDisplay>(TypeDisplay.Wait)
   const [update, setUpdate] = useState<number>(0)
   const [courses, setCourses] = useState()
   const [coursesTmp, setCoursesTmp] = useState()
   const [messages, setMessages] = useState()
   const dejaFait = useRef(false)
   const { flows } = useFlowTaxiContext()
   const searchParams = useSearchParams();
   const filtre = getFiltreCourse(searchParams.get('filtre'))
   // const channelFlowJustReceived = new BroadcastChannel('flow-juste-received');

   //let dataTmp = null
   // const [dataTmp, SetdataTmp] = useState()


   useEffect(() => {
      console.log("---------------------------------")
      console.log("---------------------------------useEffect new flows", flows)
      console.log("---------------------------------")
      if (flows !== undefined) {
         console.log("affichage course", flows)
         setCourses(flows?.flow?.courses)
         setMessages(flows?.flow?.messages)

         if (flows?.flow?.messages && flows?.flow?.messages.length > 0) {
            console.log("AFFICHAGE ------ MESSAGES")
            setWhatDisplay(TypeDisplay.Messages)
         }
         else {
            setWhatDisplay(TypeDisplay.Courses)
            console.log("AFFICHAGE ------ COURSES")
         }
      }

      else {
         console.log("on va charger ce qu'il y a dans DB")
         // const data =  getCoursesFromDb().all()
         // setCourses(data.all())

         // getCoursesFromDb()
         //    .then((data) => {
         //       console.log("il y a ca : ", data)
         //       setCourses(data)
         //       setUpdate(update + 1)
         //    })
         //    .catch((e) => {
         //       setWhatDisplay(TypeDisplay.Wait)
         //       console.log("AFFICHAGE ------ WAIT")
         //    })
         console.log("llll")
         async function getCourses() {
            const data = await getCoursesFromDb()
            console.log("il y a ca : ", data)
            setCourses(data)
            setWhatDisplay(TypeDisplay.Courses)
            console.log("AFFICHAGE ------ COURSES")
         }
         getCourses()
      }

   }, [flows])

   // useEffect(() => {
   //    console.log("useeffect courses")
   //    if (coursesTmp && coursesTmp.length>0)
   //       console.log("courseTmp !!!!")
   //       setCourses(coursesTmp)

   // }, [coursesTmp])


   // useEffect(() => {
   //    console.log("---------------------------------")
   //    console.log("---------------------------------useEffect raffrai flows", flows)
   //    console.log("---------------------------------")     
   // })


   // if (!dejaFait.current) {
   //    dejaFait.current = true
   //    channelFlowJustReceived.addEventListener('message', event => {
   //       getCoursesFromDb()
   //          .then((data) => {
   //             console.log("envcoi a affichage courses 1", data)
   //             SetdataTmp(data)
   //          })
   //          .catch((e) => {
   //          })
   //    })
   // }

   // useEffect(() => {
   //    if (dataTmp !== undefined) {
   //       setWait(false)
   //       console.log("envcoi a affichage courses", dataTmp)
   //       setCourses(dataTmp)
   //    }
   //    else {
   //       setWait(true)
   //    }
   //    console.log("COURSES", courses)
   // }, [dataTmp])



   return (
      <>
         {(whatDiplay == TypeDisplay.Courses) && <CourseAffichage filtreCourse={filtre} courses={courses} clickable={true} />}
         {(whatDiplay == TypeDisplay.Messages) && <MessageAffichage messages={messages} clickable={true} />}
         {(whatDiplay == TypeDisplay.Wait) &&
            <div className="flex justify-center flex-row h-screen items-center">
               <Button disabled>
                  <Loader2 className="animate-spin" />
                  Chargement en cours 
               </Button>
            </div>}
      </>


   )
}
