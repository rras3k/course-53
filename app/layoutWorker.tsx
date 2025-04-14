"use client";

import React from "react";
import "./globals.css";

// let serviceWorkerRegistration = null;


export default function LayoutWorker({ children, }: { children: React.ReactNode; }) {

	React.useEffect(() => {
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
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
			});
		}
	}, []);
	return (
		<>
			{children}
		</>
	);

}

// export default function LayoutWorker({children,}: {children: React.ReactNode;}) {
// 	React.useEffect(() => {
// 		if ("serviceWorker" in navigator) {
// 			navigator.serviceWorker
// 				.register("/sw.js")
// 				.then((serviceWorkerRegistration) => {
// 					// serviceWorkerRegistration =  navigator.serviceWorker.getRegistration();
// 					console.log("navigator.serviceWorker", navigator.serviceWorker.getRegistration())

// 					console.log("Service Worker registered with scope:", serviceWorkerRegistration.scope);
// 				})
// 				.catch((error) => {
// 					console.error("Service Worker registration failed:", error);
// 				});
// 		}
// 	}, []);
// 	return (
// 		<>
// 			{children}
// 		</>
// 	);
// }
