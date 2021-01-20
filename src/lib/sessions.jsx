


export async function readSession(pid) {
    return new Promise((resolve, fail) => {
	chrome.storage.local.get(['p' + pid.toString()], function(result) {
	    console.log(JSON.parse(result));
	    resolve(result);
	})
    }).then((res) => {
	return res;
    }).catch((e) => {
	return undefined;
    });;
}
