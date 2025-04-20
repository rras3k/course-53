// Import des variables de base
importScripts("/sw-affinis.js");
importScripts("/compat.js");


let interval = null

// Listener pour l'initialisation des variables pour le worker
const channelInitVar = new BroadcastChannel('initvar')

// Post d'un boolean indiquant si detection de proposition lors de la derniere reception de courses pour un taxi
const channelHasNotification = new BroadcastChannel('sw-hasNotification');

// Post d'un tableau JSON contenant la derniere reception de courses pour un taxi
const channelCourseData = new BroadcastChannel('sw-courses-data');

// Post d'un tableau JSON contenant la derniere reception des messages pour un taxi
const channelMessages = new BroadcastChannel('sw-messages-data');

// Post d'un tableau JSON contenant la derniere reception de courses de tous les taxis
const channelAllCourseData = new BroadcastChannel('sw-all-courses-data');

// Post d'un boolean indiquant qu'il faut supprimer toutes traces de la derniere session en dehors du web worker
const channelToDeconnect = new BroadcastChannel('sw-to-deconnect');

// Listener d'un boolean indiquant si il faut supprimer toute trace de la derniere session dans le web worker
const channelToDeconnectToSW = new BroadcastChannel('deconnect');

// Listener d'un boolean indiquant si il faut supprimer toute tra
// ce de la derniere session dans le web worker
const channelToPing = new BroadcastChannel('ping');
const channelToPong = new BroadcastChannel('pong');

const channelCloseWebWorker = new BroadcastChannel('close-webworker');


console.log("WS> FIRTS SW-ARTAXI")

channelInitVar.addEventListener('message', event => {
	console.log('Received initvar', event.data)
	initVar(event.data)
	console.log("ca marche token = ", token)
	backProcess();
});

channelCloseWebWorker.addEventListener('message', event => {
	console.log('WS> Received ordre d arreter ', event.data)

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
		  .register("/sw.js", { scope: "/" })
		  .then((registration) => {
			// registration worked
			console.log("Registration succeeded.");
			registration.unregister().then((boolean) => {
			  // if boolean = true, unregister is successful
			});
		  })
		  .catch((error) => {
			// registration failed
			console.error(`Registration failed with ${error}`);
		  });
	  }
});

channelToPing.addEventListener('message', event => {
	console.log('Received ping', event.data)
	channelToPong.postMessage({ alive: true })
});

channelToDeconnectToSW.addEventListener('message', event => {
	console.log('Received channelToDeconnectToSW', event.data)
	identClear()
	channelHasNotification.postMessage({ hasProposition: false, date: Date.now() })
});

function identClearAndPost() {
	console.log(" ============== RESET AND POST===============")
	identClear()
	console.log("envoi message Deconnect")
	channelToDeconnect.postMessage({ deconnect: true })
}

function identClear() {
	console.log(" ============== RESET (identClear) ===============")
	profilId = ""
	token = ""

	// Suppression du cache: Appels API serveur
	// caches.delete(cacheName).then(() => {
	// 	// le cache est maintenant supprimé
	// 	console.log('app/identification/page.tsx > cacheName est supprimé', cacheName);
	// });
	// cacheName = ""


	// Suppression IndexedDB 
	clear()

	// Suppression local.storage
	// localStorage.clear();

	// Supprime le processus de bouclage
	clearInterval(interval)
}

// if (!periodiqueEncours) {
// 	periodiqueEncours = true
// 	backProcess()
// }

function backProcess() {
	backProcessAction()
	interval = setInterval(async () => {
		console.log("WS> FIRTS SW-ARTAXI", interval, token, version)
		backProcessAction()
	}, delaiApiGetCourse);
	return () => clearInterval(interval)
}

function backProcessAction() {
	console.log("WS> backProcessAction", token)
	getCoursesTaxi()
}

async function getTokenUrlApi() {
	// let token = ""
	// let urlApi = ""
	token = await get("token")
	urlApi = await get("urlApi")
	// console.log(" getTokenUrlApi => token, urlApi", token, urlApi)
	// return [token, urlApi]
}

function isVarOkForFetch() {
	return !(token === "" || urlApi === "" || token === undefined || urlApi === undefined)
}

async function getCoursesTaxi() {

	console.log("> getCoursesTaxi", token, urlApi)
	if (!isVarOkForFetch()) {
		console.log("WS> pas ok")
		// [token, urlApi] = getTokenUrlApi()
		getTokenUrlApi()
	}
	if (!isVarOkForFetch()) {
		console.log("WS> getCoursesTaxi token ou urlApi null", profilId)
		identClearAndPost()
	}
	if (!isVarOkForFetch()) return ""
	try {
		const response = await fetch(
			urlApi + "/trips/today/",
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				method: 'GET'
			}
		);
		const data = await response.json();
		constdateNow = Date.now()

		if (!data?.retour) { // la requete échoue par mauvaise identification
			// channelToDeconnect.postMessage({ deconnect: true })
			console.log("WS> identClearAndPost getCoursesTaxi")
			identClearAndPost() // On supprime tout dans indexDB et cache pour être rediriger par un middleware vers identification
			// token = ""
		}
		else {
			channelCourseData.postMessage({ courses: data.data.courses, date: constdateNow })
			channelMessages.postMessage({ messages: data.data.messages, date: constdateNow })
			lastCoursesDatasReceive = Date.now()


			if (dcHasProposition(data)) {
				sendNotification("Nouvelles propositions de course", "Veuillez valider les courses à prendre");
				channelHasNotification.postMessage({ hasProposition: true, date: constdateNow })
			}
			else {
				channelHasNotification.postMessage({ hasProposition: false, date: constdateNow })
			}


		}
	}
	catch (e) {
		console.error("WS> ERREUR /trips/today/", e);
	}
}

// async function getCoursesAllTaxis() {
// 	console.log(" ======================== ADMN =============================")
// 	try {
// 		const response = await fetch(
// 			urlApi + "/trips/today-all",
// 			{
// 				headers: {
// 					'Authorization': `Bearer ${token}`,
// 					"Content-Type": "application/json",
// 				},
// 				method: 'GET'
// 			}
// 		);
// 		const data = await response.json();
// 		constdateNow = Date.now()
// 		if (data?.message) { // la requete échoue par mauvaise identification
// 			channelToDeconnect.postMessage({ deconnect: true })
// 			identClearAndPost() // On supprime tout dans indexDB et cache pour être rediriger par un middleware vers identification
// 			token = ""
// 		}
// 		else {
// 			channelAllCourseData.postMessage({ datas: data, date: constdateNow })
// 		}
// 	}
// 	catch (e) {
// 		console.error("ERREUR /trips/today-all", e);
// 	}
// }

const dcHasProposition = (datas) => {
	let hasProposition = false;
	datas.data.courses.map((course) => {
		hasProposition = hasProposition || (course.course_status == "1" && (course.taxi_name == "" || course.taxi_name == null));
	});
	return hasProposition;
}

const sendNotification = async (title, text) => {
	get("stateDisplayNotification")
		.then((value) => {
			// console.log("stateDisplayNotification value = ", value)
			if (value) {
				if (Notification.permission === 'granted') {
					showNotification(title, text);
				}
				else {
					if (Notification.permission !== 'denied') {
						Notification.requestPermission()
							.then((permission) => {
								if (permission === 'granted') {
									showNotification(title, text);
								}
							})
					}
				}
			}
		})
		.catch((e) => {
			console.log("WS> error get(stateDisplayNotification)", e)
			set("stateDisplayNotification", true)

		})
};

const showNotification = async (title, text) => {
	if (title && text) {
		const payload = {
			body: String(text),
			icon: "/icons/icon-192x192.png",
			requireInteraction: true

		};
		if ('showNotification' in registration) {
			registration.showNotification(String(title), payload);
		}
		else {
			new Notification(String(title), payload);
		}
	}
};

backProcess()