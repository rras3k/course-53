'use client'

import { tokenName, cacheName, Ident } from "./affinis";
import {get,set, clear} from "idb-keyval"

export function getVersion(){
	return "1.0.73" 
}

export function identSet(identData: Ident): boolean {

	//indexDB pour le service worker
	set("token", identData.token);
	set("profilId", identData.profilId);
	set("lastname", identData.nom);
	set("firstname", identData.prenom);
	set("urlApi", process.env.NEXT_PUBLIC_API_URL);

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

export async function identClear(isCache:boolean = false) {
	// reset var
	// Suppression du cache: Appels API serveur
// export async function identClear(isCache = false) {
	if ( isCache && cacheName) {
		window.caches.open(cacheName).then((cache) => {
			cache.keys().then((keys) => {
				keys.forEach((request) => {
					cache.delete(request);
				});
			});
		});
	}

	// Suppression dans IndexedDB 
	clear()

	// Suppression local.storage
	localStorage.clear();

	// Post d'un boolean indiquant qu'il faut supprimer toute trace de la derniere session dans le web worker
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

export function setCoursesIntoDb(data: object[]){
	console.log("setCourseIntoDb(data: object[])",data)
	set("courses",data)
}

export async function getCoursesFromDb(): Promise<object[] | undefined> {
	return await get("courses")
}

export function setMessagesIntoDb(data: object[]){
	console.log("setMessagesIntoDb(data: object[])",data)
	set("messages",data)
}

export async function getMessagesFromDb(): Promise<object[] | undefined> {
	return await get("messages")
}



const dcHasProposition = (datas) => {
	let hasProposition = false;
	datas.data.courses.map((course) => {
		hasProposition = hasProposition || (course.course_status == "1" && (course.taxi_name == "" || course.taxi_name == null));
	});
	return hasProposition;
}