export async function readSession(pid) {
    const key = 'p' + pid.toString();
    return new Promise((resolve, fail) => {
	chrome.storage.local.get([key], function(result) {
	    resolve(result[key]);
	})
    }).then((res) => {
	return JSON.parse(res);
    }).catch((e) => {
	console.log(e);
	return undefined;
    });;
}
