// importScripts("/compat.js");
importScripts("/sw-artaxi.js");
// const appVerison="1.0.1"

console.log("WS>  cachename  = ", cacheName)

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

];
// "/aide",
// "/parametrage",
// "/taxi/courses",
// "/taxi/course-filtre",
// "/taxi/message",
// "/identification",
//"/click.mp3"
self.addEventListener('load', (event) => {
	console.log("WS>  =======================================WEBWORKER LOAD ", cacheName)
})

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
	console.log("WS>  =======================================WEBWORKER INSTALL ", cacheName)

	try {
		event.waitUntil(
			clearCacheExcept(cacheName)
		)
		event.waitUntil(
			caches.open(cacheName).then((cache) => {
				try {
					cache.addAll(ASSETS_TO_CACHE)
				}
				catch (e) {
					console.log("WS>  erreur addAll : ", e)
				}
			}
			));
	}
	catch (e) {
		console.log("WS>  erreur open : ", e)
	}

});

// Activate the service worker and clear old caches
self.addEventListener('activate', (event) => {
	console.log("WS>  =======================================WEBWORKER ACTIVATE : ",cacheName)
	event.waitUntil(
		clearCacheExcept(cacheName)
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

function clearCacheExcept(cacheName){
	caches.keys().then((cacheNames) => {
		return Promise.all(
			cacheNames
				.filter((cacheNameInd) => cacheNameInd !== cacheName)
				.map((cacheNameInd) => {
					console.log("WS>  cacheNameInd,cacheName",cacheNameInd,cacheName)
					caches.delete(cacheNameInd)
				})
		);
	})
}

