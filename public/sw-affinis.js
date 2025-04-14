 let cacheName = "CACHE_V_1.00"
let delaiApiGetCourse = 15000
let token = ""
let periodiqueEncours = false
let profilId = ""
let profilTaxi = "1"
let profilAdmin = "4"
let urlApi = ""

let lastCoursesDatasReceive =null



function initVar(initDatas) {
    // cacheName = initDatas.cacheName
    delaiApiGetCourse = initDatas.delaiApiGetCourse
    token = initDatas.token
    profilId = initDatas.profilId
    urlApi = initDatas.urlApi
}


function isProfilTaxi(){
    return profilId === profilTaxi
}

function isProfilAdmin(){
    return profilId === profilAdmin
}