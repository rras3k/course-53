"use client"

import { useEffect } from "react";

let wakeLock = null;

export default function ScreenWakeLock() {
    const requestWakeLock = async (onVisibilityChange = false) => {
    // const requestWakeLock = async (onVisibilityChange = false) => {
    console.log(onVisibilityChange)
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock was released');
                wakeLock = null;
            });
        }
        catch (err) {
            console.error(err);
        }
    };

    const handleVisibilityChange = async () => {
        await requestWakeLock(true);
    }

    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
    })
    return <></>
}
