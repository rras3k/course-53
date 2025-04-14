

/*** 
* Demande d'identification au serveur  
* @param 
* @returns 
*/
export async function identAskServer(login: string, mdp: string) {
	const data = await fetch(
		process.env.NEXT_PUBLIC_API_URL + '/identification'
		, {
			method: 'POST',
			body: '{"login":"' + login + '", "password":"' + mdp + '", "version_app_mobile":"1.0.0"}'
		}
	)
	return await data.json();
}

