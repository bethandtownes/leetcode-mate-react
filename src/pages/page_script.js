console.log("[status]: page_script fired")

const CN = document.getElementsByClassName("css-19dbiou-HomeWrapper e1925exm1")[0] != undefined;


const useMonaco = () => {
    return document.getElementsByClassName("css-1jwxfyp-IndicatorButton e8k12jq1")[0] != undefined;
};

let editorConfig = {
    bracketMatching: false,
    blinkingCursor: false
};


function setEditor() {
    if (useMonaco() == false) {
	const editor = document.querySelector(".CodeMirror").CodeMirror;
	if (editor == undefined || editor == null) return;
	document.querySelector(".CodeMirror").CodeMirror.setOption("autoCloseBrackets", editorConfig.bracketMatching);
	document.querySelector(".CodeMirror").CodeMirror.setOption("cursorBlinkRate", editorConfig.blinkingCursor ? 530 : 0);
    }
};


window.addEventListener("EDITOR_CONFIG_EVENT", function(event) {
    if (event.detail.action == "INIT") {
	editorConfig = event.detail.data;
	setEditor();
    }
    if (event.detail.action == "UPDATE") {
	editorConfig = event.detail.data;
	setEditor();
    }
}, false);

window.addEventListener('click', function() {
    setEditor();
});


window.addEventListener("EDITOR_GRAB", function test() {
    if (useMonaco()) {
	window.postMessage({action: 'EDITOR_VALUE', payout: monaco.editor.getModels()[0].getValue()});
    }
    else {
	window.postMessage({action: 'EDITOR_VALUE', payout: document.querySelector(".CodeMirror").CodeMirror.getValue()});
}
});
