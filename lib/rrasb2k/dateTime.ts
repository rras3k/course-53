export function getHHMM(){
    return (new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
export function getHHMMSS():string{
    return (new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit",second: "2-digit" })
}