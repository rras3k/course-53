
export const tokenName:string = "token"

import { getAppVersion } from "./rrasb2k/app";


export const cacheName = "cache_" + getAppVersion()

// -------------- API /trips/today-all
export const urlApi_today_all: string = "/trips/today-all"

// api : "/trips/today-all"
export type todayAllDataType = {
    id: string,
    rgp_course_id: string
    course_id: string
    user_id: string
    user_proposition_id: string
    taxi_name: string
    first_takeover_arret_code: string
    first_takeover_arret_libelle: string
    first_takeover_date: string
    last_dropoff_arret_code: string
    last_dropoff_arret_libelle: string
    last_dropoff_date: string
    client_nom: string
    client_nb: string
    course_status: string
    masque: string
    status_new: string
}

export type todayAllType = {
    message: string,
    data?: todayAllDataType[]
}

// -------------- API  /trips/today/
export const urlApi_today: string = "/trips/today"

// export type todayDataType = {}
export type MessageBroadCastToday = {
    hasProposition:boolean
    date: number
    data:Array<JSON>
}

export enum ProfilEnum {
    Taxi = "1",
    Artaxi = "2",
    Centrale = "3",
    Admin = "4"
}

export type Ident = {
    token: string
    profilId: string
    nom: string
    prenom: string
}


export enum Course_statut {
    Annule = "0",
    A_faire = "1",
    Cloturee = "2"
}

export enum Filtre_course_url_query {
    A_faire = 'a-faire-et-propositions',
    Proposition = 'propositions',
    Cloturee = 'cloturees',
    Annulee = 'annulees',
    Toute = 'toutes',
}

export enum Filtre_course_color {
    A_faire = 'green',
    Proposition = 'yellow',
    Cloturee = 'blue',
    Annulee = 'gray',
    Toute = 'red',
}

export function getFiltreCourseColor(filtreCourseQuery: string | null): string  {
    switch (filtreCourseQuery) {
        case Filtre_course_url_query.A_faire: return 'bg-'+Filtre_course_color.A_faire + '-200'; break;
        case Filtre_course_url_query.Proposition: return 'bg-'+Filtre_course_color.Proposition+ '-200'; break;
        case Filtre_course_url_query.Cloturee: return 'bg-'+Filtre_course_color.Cloturee+ '-200'; break;
        case Filtre_course_url_query.Annulee: return 'bg-'+Filtre_course_color.Annulee+ '-200'; break;
        default: return 'bg-'+Filtre_course_color.A_faire + '-200';
    }
}

export function getFiltreCourseFillColor(filtreCourseQuery: string | null): string {
    switch (filtreCourseQuery) {
        case Filtre_course_url_query.A_faire: return 'fill-' + Filtre_course_color.A_faire + '-200'; break;
        case Filtre_course_url_query.Proposition: return 'fill-' + Filtre_course_color.Proposition + '-200'; break;
        case Filtre_course_url_query.Cloturee: return 'fill-' + Filtre_course_color.Cloturee + '-200'; break;
        case Filtre_course_url_query.Annulee: return 'fill-' + Filtre_course_color.Annulee + '-200'; break;
        default: return  'fill-' + Filtre_course_color.A_faire + '-200';
    }
}

export function getFiltreCourse(queryFiltre: string | null): string {
	switch (queryFiltre) {
		case Filtre_course_url_query.A_faire: return Filtre_course_url_query.A_faire; break;
		case Filtre_course_url_query.Annulee: return Filtre_course_url_query.Annulee; break;
		case Filtre_course_url_query.Cloturee: return Filtre_course_url_query.Cloturee; break;
		case Filtre_course_url_query.Proposition: return Filtre_course_url_query.Proposition; break;
		case Filtre_course_url_query.Toute: return Filtre_course_url_query.Toute; break;
		default: return Filtre_course_url_query.A_faire; break;
	}
}

export function isPathCourseFiltreTaxi(path:string):boolean{
	return (path === "/taxi/courses/")
}
export function isPathCourseFiltreAllTaxi(path:string):boolean{
	return (path === "/admin/courses/")
}

//  ROUTE

type RouteInfo = {
    titre:string
    profilId:string[] | null
}
const route: { [key: string]: RouteInfo } = {};

route[''] = {titre:'',profilId:null}
route['/'] = {titre:'',profilId:null}

route['/aide/'] = {titre:'aide',profilId:null}
route['/identification/'] = {titre:'aide',profilId:null}
route['/installation/'] = {titre:'installation',profilId:null}
route['/parametrage/'] = {titre:'parametrage',profilId:null}

route['/taxi/courses/'] = {titre:'courses',profilId:[ProfilEnum.Taxi]}
route['/taxi/course-filtre/'] = {titre:'filtre',profilId:[ProfilEnum.Taxi]}
route['/taxi/messages/'] = {titre:'messages',profilId:[ProfilEnum.Taxi]}



export const getTitle = (pathname: string) => {
    console.log("getTitle ", pathname)
    try{
        return (route[pathname]).titre;
    }
    catch(e){
        return ""
    }
}
