console.log("[status]: page_script fired")


const DESC_BUTTON = "react-codemirror2";

// function makeEmacsEnhancement() {
//     try {
// 	if (EMACS_ENHANCE) {
// 	    document.querySelector(".CodeMirror").CodeMirror.setOption("autoCloseBrackets", false);
// 	    document.querySelector(".CodeMirror").CodeMirror.setOption("cursorBlinkRate", 0);
// 	}
//     }
//     catch (e) {
// 	// do nothing
//     }
// };



const useMonaco = () => {
    return document.getElementsByClassName("css-1jwxfyp-IndicatorButton e8k12jq1")[0] != undefined;
};



window.addEventListener("BRACKET_MATCH_OFF", function() {
    if (useMonaco() == false) {
	document.querySelector(".CodeMirror").CodeMirror.setOption("autoCloseBrackets", false);
    }
    console.log("BON");
});

window.addEventListener("BRACKET_MATCH_ON", function() {
    if (useMonaco() == false) {
	document.querySelector(".CodeMirror").CodeMirror.setOption("autoCloseBrackets", true);
    }
    console.log("BOFF");
});
			

window.addEventListener("EMACS", function() {
    if (useMonaco() == false) {
	document.querySelector(".CodeMirror").CodeMirror.setOption("autoCloseBrackets", false);
	document.querySelector(".CodeMirror").CodeMirror.setOption("cursorBlinkRate", 0);
    }
});


window.addEventListener("EDITOR_GRAB", function test() {
    /* console.log("[status]: event listener [EDITOR GRAB] injected"); */
    if (useMonaco()) {
	/* console.log("detected Monaco"); */
	window.postMessage({action: 'EDITOR_VALUE', payout: monaco.editor.getModels()[0].getValue()});
    }
    else {
	/* console.log("detected codemirror"); */
	window.postMessage({action: 'EDITOR_VALUE', payout: document.querySelector(".CodeMirror").CodeMirror.getValue()});
    }
});
