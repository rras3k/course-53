'use client'

import { tokenName, cacheName, Ident } from "./affinis";

export function identSet(identData: Ident): boolean {

	//indexDB pour le service worker
	// set(token, identData.token);
	// set("profilId", identData.profilId);
	// set("nom", identData.nom);
	// set("prenom", identData.prenom);

	// Local storage pour le reste de l'application
	localStorage.setItem(tokenName, identData.token);
	localStorage.setItem("profilId", identData.profilId);
	localStorage.setItem("lastname", identData.nom);
	localStorage.setItem("firstname", identData.prenom);
	identSendinitVarWorker(identData.token, identData.profilId)
	return true;
}

function identSendinitVarWorker(token: string, profilId: string) {
	console.log("identSendinitVarWorker")
	const channelInitVar = new BroadcastChannel('initvar')
	channelInitVar.postMessage({
		cacheName: process.env.NEXT_PUBLIC_CACHE_NAME,
		delaiApiGetCourse: process.env.NEXT_PUBLIC_DELAI_API_COURSE,
		token: token,
		profilId: profilId,
		urlApi: process.env.NEXT_PUBLIC_API_URL,
	})
	channelInitVar.close()
	console.log("identSendinitVarWorker FIN")

}

export async function identClear() {
	// reset var
	// Suppression du cache: Appels API serveur
	if (cacheName) {
		window.caches.open(cacheName).then((cache) => {
			cache.keys().then((keys) => {
				keys.forEach((request) => {
					cache.delete(request);
				});
			});
		});
	}

	// Suppression dans IndexedDB 
	//clear()

	// Suppression local.storage
	localStorage.clear();

	// Post d'un boolean indiquant si il faut supprimer toute trace de la derniere session dans le web worker
	const channelToDeconnectToSW = new BroadcastChannel('deconnect');
	channelToDeconnectToSW.postMessage({ deconnect: true })
	channelToDeconnectToSW.close()

}

// export function hasPropositionDelete(): void {
// 	del("hasProposition");
// }


export function identGetProfilId() {
	return localStorage.getItem("profilId")
}

export function getVersion(){
	return "1.0.15"
}


