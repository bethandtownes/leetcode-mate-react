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


const useMonaco = () => {
    return document.getElementsByClassName("css-1jwxfyp-IndicatorButton e8k12jq1")[0] != undefined;
};

window.addEventListener("EDITOR_GRAB", function test() {
    console.log("[status]: event listener [EDITOR GRAB] injected");
    if (useMonaco()) {
	/* console.log("detected Monaco"); */
	window.postMessage({action: 'EDITOR_VALUE', payout: monaco.editor.getModels()[0].getValue()});
    }
    else {
	/* console.log("detected codemirror"); */
	window.postMessage({action: 'EDITOR_VALUE', payout: document.querySelector(".CodeMirror").CodeMirror.getValue()});
    }
});
