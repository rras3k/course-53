
/*** Détermine la valeur d'un input par son id.
*
* @param 
* @returns Valeur de l'input sous forme string, si echec, null
*/
export function getInputStringValue(selector: string): string | null {
    return (document.querySelector("#login") === null ? null : (<HTMLInputElement>document.querySelector("#"+selector))?.value)
}