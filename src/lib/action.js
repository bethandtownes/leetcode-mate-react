import { submit } from "./submit.js";



/* async function acquireEditorValue(waitTime = 200, attempt = 1) {
 *     if (attempt > 3) {
 * 	DEBUG("maxout 3 attempts, no value accquired");
 * 	return null;
 *     }
 *     async function makeAttempt() {
 * 	let result = null;
 * 	function handleEditorValue(event) {
 * 	    if(event.data.action === 'EDITOR_VALUE') {
 * 		result = event.data.payout;
 * 	    }
 * 	}
 * 	window.addEventListener("message", handleEditorValue, false);
 * 
 * 	let event = new CustomEvent('EDITOR_GRAB');
 * 	window.dispatchEvent(event);
 * 	var promise = new Promise((resolve, fail) => {
 * 	    setTimeout(() => {
 * 		DEBUG("received value and remove listener");
 * 		window.removeEventListener("message", handleEditorValue, false);
 * 		DEBUG("eventListener[message, handleEditorvalue] removed");
 * 		resolve(result);
 * 	    }, waitTime)
 * 	});
 * 	return promise;
 *     }
 *     const a = await makeAttempt();
 *     if (a == null) {
 * 	DEBUG("NULL received");
 * 	return getEditorValue(waitTime + 200, attempt + 1);
 *     }
 *     else {
 * 	return a;
 *     }
 * }
 * 
 * function acquireDefaultTestCase() {
 *     const e = document.getElementsByClassName("ace_layer ace_text-layer")[0];
 *     if (e == undefined) {
 * 	// DEBUG("no text case input area found");
 * 	return;
 *     }
 *     console.log("called");
 *     return Array.from(e.children).map(x => x.textContent).join('\n')
 * } */

/* export { acquireEditorValue, acquireCsrftoken }; */


export { submit };
