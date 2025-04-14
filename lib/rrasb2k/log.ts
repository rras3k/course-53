export enum LogLevel {
    Vital = 1,
    Important = 2,
    Info = 3
}


/*** Ecrit du texte dans fichier log sur le client.
*
* @param 
* @returns 
*/
export function logWrite(text: string, logLevel: LogLevel): void {
    console.log(text, logLevel)
}