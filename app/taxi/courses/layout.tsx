"use client"

import { ReactNode } from "react";
// import CourseTaxiProvider from "@/providers/has-proposition-provider";



export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <>
            {/* <CourseTaxiProvider> */}
                {children}
            {/* </CourseTaxiProvider> */}
        </>
    )
}