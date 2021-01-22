
export async function readSession(pid) {
    const key = 'p' + pid.toString();
    console.log('called here');
    console.log(key);
    return new Promise((resolve, fail) => {
	chrome.storage.local.get([key], function(result) {
	    console.log(result);
	    console.log(result[key]);
	    resolve(result[key]);
	})
    }).then((res) => {
	return JSON.parse(res);
    }).catch((e) => {
	console.log(e);
	return undefined;
    });;
}


