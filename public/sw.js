// importScripts("/compat.js");
importScripts("/sw-artaxi.js");
const appVerison="1.0.1"

console.log("cachename  = ", cacheName)

// Liste des fichiers à mettre en cache lors de la création du worker
const ASSETS_TO_CACHE = [
	"/icon-48x48.png",
	"/icon-72x72.png",
	"/icon-96x96.png",
	"/icon-128x128.png",
	"/icon-144x144.png",
	"/icon-152x152.png",
	"/icon-192x192.png",
	"/icon-384x384.png",
	"/icon-512x512.png",
	"/aide",
	"/parametrage",
	"/taxi/courses",
	"/taxi/course-filtre",
	"/taxi/message",
	"/identification",
	"/click.mp3"
];

/*
Copy to Clipboard
const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
	addResourcesToCache([
	  "/",
	  "/index.html",
	  "/style.css",
	  "/app.js",
	  "/image-list.js",
	  "/star-wars-logo.jpg",
	  "/gallery/bountyHunters.jpg",
	  "/gallery/myLittleVader.jpg",
	  "/gallery/snowTroopers.jpg",
	]),
  );
});
*/

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
	try {
		event.waitUntil(
			caches.open(cacheName).then((cache) => {
				try {
					cache.addAll(ASSETS_TO_CACHE)
				}
				catch (e) {
					console.log("erreur addAll : ", e)
				}
			}
			));
	}
	catch (e) {
		console.log("erreur open : ", e)
	}

});

// Activate the service worker and clear old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => cacheName !== cacheName)
					.map((cacheName) => caches.delete(cacheName))
			);
		})
	);
});

// Stockage des requètes dans le cache
self.addEventListener('fetch', (event) => {
	if (event.request.method === "GET") {
		event.respondWith(
			caches.match(event.request).then((response) => {
				return (
					response ||
					fetch(event.request)
						.then((fetchResponse) => {
							return caches.open(cacheName).then((cache) => {
								cache.put(event.request, fetchResponse.clone());
								return fetchResponse;
							});
						})
						.catch(e => {
							console.error("lecture cache errreur", e);
						})
				);
			})
		);
	}
});

// self.addEventListener('load', () => {
// });




/*
vedayex428@gufutu.com
Wqa12zsx
https://tk14.info6.lnkml.com/r/?id=h554970bb,cc766bf,187167&p1=www.disonsdemain.fr/authent/mat.php?ibl=1430876347&enc=179478E4538FE7D19429AA5D6E08EAA64A7FC0F9ECDC1C010CB5DFB7751FB820430C538293A77083844C180DFEFAD7093DCC747C769CC1DA8CD852004272C5B744B0274D8EB29AE7D6D119D9727648F5&co=4001011&target=/home/index.php
*/
