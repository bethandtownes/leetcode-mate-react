const DEBUG_MODE = false;
function DEBUG(s) {
    if (DEBUG_MODE == true) {
	if (typeof(s) == "object") {
	    console.log("[DEBUG] ")
	    console.log(s);
	    return;
	}
	console.log("[DEBUG]: " + s);
    }
}


export { DEBUG };
