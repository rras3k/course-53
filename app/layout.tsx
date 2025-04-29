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

            console.log("update found")
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

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        // sometime later…
        reg.update();
      });
    }


    /*
    navigator.serviceWorker.register('/sw.js').then(reg => {
      reg.installing; // the installing worker, or undefined
      reg.waiting; // the waiting worker, or undefined
      reg.active; // the active worker, or undefined
    
      reg.addEventListener('updatefound', () => {
        // A wild service worker has appeared in reg.installing!
        const newWorker = reg.installing;
    
        newWorker.state;
        // "installing" - the install event has fired, but not yet complete
        // "installed"  - install complete
        // "activating" - the activate event has fired, but not yet complete
        // "activated"  - fully active
        // "redundant"  - discarded. Either failed install, or it's been
        //                replaced by a newer version
    
        newWorker.addEventListener('statechange', () => {
          // newWorker.state has changed
        });
      });
    });
    
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // This fires when the service worker controlling this page
      // changes, eg a new worker has skipped waiting and become
      // the new active worker.
    });
    */


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