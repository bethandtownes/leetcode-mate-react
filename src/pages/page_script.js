console.log("[status]: page_script fired")

const CN = document.getElementsByClassName("css-19dbiou-HomeWrapper e1925exm1")[0] != undefined;



const useMonaco = () => {
    return document.getElementsByClassName("css-1jwxfyp-IndicatorButton e8k12jq1")[0] != undefined;
};


let editorConfig;


async function setEditor()  {  
    if (useMonaco() == false) {
	
	if (CN) {
	    for (let i = 0; i < 30; ++i) {
		const elm = await new Promise((resolve, fail) => {
		    setTimeout(() => {
			resolve(document.getElementsByClassName("css-pwvbgl-CodeAreaContainer ejldciv0")[0]);
		    }, 300);
		});

		if (elm == undefined || elm == null) {
		    continue;
		}
		else {
		    const editor = document.querySelector(".CodeMirror").CodeMirror;
		    if (editor == undefined || editor == null) return;
		    editor.setOption("autoCloseBrackets", editorConfig.autoCloseBrackets);
		    editor.setOption("cursorBlinkRate", editorConfig.blinkingCursor ? 530 : 0);

		    elm.style['display']= editorConfig.hide ? 'none' : '';
		    break;
		}
		

	    }
	}
	else {
	    for (let i = 0; i < 30; ++i) {
		const elm = await new Promise((resolve, fail) => {
		    setTimeout(() => {
			resolve(document.querySelector('[data-cy="code-area"]'));
		    }, 300);
		});
		if (elm == null || elm == undefined) continue;
		else {
		    const editor = document.querySelector(".CodeMirror").CodeMirror;
		    if (editor == undefined || editor == null) return;
		    editor.setOption("autoCloseBrackets", editorConfig.autoCloseBrackets);
		    editor.setOption("cursorBlinkRate", editorConfig.blinkingCursor ? 530 : 0);
		    if (editorConfig.hide == true) {
			console.log('hide');
			document.querySelector('[data-cy="code-area"]').parentElement.style['flex'] = "0 0 1px";
			document.querySelector('[data-id="0"]').style['flex'] = "1 0 0px";
		    }
		    else {
			document.querySelector('[data-cy="code-area"]').parentElement.style['flex'] = "1 0 320px";
			document.querySelector('[data-id="0"]').style['flex'] = "0 1 400px";
		    }
		    break;
		}
	    }
	}
	
    }
};


window.addEventListener("EDITOR_CONFIG_EVENT", function(event) {
    if (event.detail.action == "SET") {
	editorConfig = event.detail.data.editor;
	setEditor();
    }
    if (event.detail.action == "ENFORCE") {
	const editor = document.querySelector(".CodeMirror").CodeMirror;
	const conf = event.detail.data.editor;

	if (editor == undefined || editor == null) return;
	if (editor.getOption("autoCloseBrackets") != conf.autoCloseBrackets) {
	    console.log('reset bracket');
	    editor.setOption("autoCloseBrackets", conf.autoCloseBrackets);
	}
	if (editor.getOption("cursorBlinkRate") > 0 && conf.blinkingCursor == false) {
	    console.log('reset cursor');
	    editor.setOption("cursorBlinkRate", 0);
	}
    }
}, false);

window.addEventListener("EDITOR_GRAB", function test() {
    if (useMonaco()) {
	window.postMessage({action: 'EDITOR_VALUE', payout: monaco.editor.getModels()[0].getValue()});
    }
    else {
	window.postMessage({action: 'EDITOR_VALUE', payout: document.querySelector(".CodeMirror").CodeMirror.getValue()});
}
});



function getCMFont() {
    console.log("getCMFont called");
    return "12px";
}
