const DEBUG_MODE = true;
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
