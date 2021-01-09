console.log("[status]: page_script fired")


const EMACS_ENHANCE = false;


function makeEmacsEnhancement() {
    try {
	if (EMACS_ENHANCE) {
	    document.querySelector(".CodeMirror").CodeMirror.setOption("autoCloseBrackets", false);
	    document.querySelector(".CodeMirror").CodeMirror.setOption("cursorBlinkRate", 0);
	    console.log("emacs enhancement made");
	}
    }
    catch (e) {
	// do nothing
    }
};


setTimeout(() => { makeEmacsEnhancement() }, 4000);


window.addEventListener("EDITOR_GRAB", function test() {
    console.log("[status]: event listener [EDITOR GRAB] injected");
    window.postMessage({action: 'EDITOR_VALUE', payout: document.querySelector(".CodeMirror").CodeMirror.getValue()});
});


