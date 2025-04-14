"use client";

import "./globals.css";
import { NavHor } from "@/components/nav-horizontal";
// import { ThemeProvider } from "@/components/theme-provider"
import LayoutWorker from "./layoutWorker";
import React from "react";
import LayoutRoute from "./layoutRoute";
import ScreenWakeLock from "@/components/screen-wake-lock";
import HasPorpositionProvider from "@/providers/has-proposition-provider";
import CourseTaxiProvider from "@/providers/course-taxi-provider";
import CourseAllTaxiProvider from "@/providers/course-all-taxi-provider";
import MessageTaxiProvider from "@/providers/message-taxi-provider";
import PwaInstall from "@/components/pwa-install"
import { Suspense } from 'react'
import { useEffect } from "react";


export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async () => {
      try {
        // @ts-ignore
        if ('wakeLock' in navigator) {
          // @ts-ignore
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.error(`Échec du Wake Lock: ${err.name}, ${err.message}`);
      }
    };

    requestWakeLock();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    });

    if ('serviceWorker' in navigator) {
      //window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => {
            console.log('SW enregistré:', reg.scope);
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      window.location.reload();
                    }
                  }
                };
              }
            };
          })
          .catch(err => console.error('SW erreur:', err));
      //});
    }





    return () => {
      if (wakeLock) wakeLock.release();
    };
  }, []);

  return (
    <html lang="fr">
      <head>
        <title>Course 53</title>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {/* <LayoutWorker> */}
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
        <PwaInstall>
          <LayoutRoute>
            {/* <ScreenWakeLock /> */}
            <HasPorpositionProvider>
              <Suspense>
                <NavHor />
              </Suspense>
            </HasPorpositionProvider>
            <CourseTaxiProvider>
              <MessageTaxiProvider>
                <CourseAllTaxiProvider>
                  <div className="pt-12 bg-black-800">
                    <div className="mx-auto md:w-[768px]">
                      <Suspense>
                        {children}
                      </Suspense>
                    </div>
                  </div>
                </CourseAllTaxiProvider>
              </MessageTaxiProvider>
            </CourseTaxiProvider>
          </LayoutRoute>
        </PwaInstall>
        {/* </ThemeProvider> */}
        {/* </LayoutWorker> */}
      </body>
    </html >
  );
}