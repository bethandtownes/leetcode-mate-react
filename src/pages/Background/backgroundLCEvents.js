chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
	leetcodeEditorSettings: JSON.stringify({
	    editor: {
		autoCloseBrackets: true,
		blinkingCursor: true
	    },
	    keybinding: {
		toggleSubmissionPane: {
		    mod1: 'Alt',
		    mod2: 'None',
		    key: 'i'
		},
		toggleMateEditor: {
		    mod1: 'Alt',
		    mod2: 'None',
		    key: 'o'
		},
		submit: {
		    mod1: 'Ctrl',
		    mod2: 'Enter',
		    key: ''
		},
		test: {
		    mod1: 'Alt',
		    mod2: 'Enter',
		    key: ''
		}
	    }
	}),
    }, function() {
	console.log('Initialized default settings');
    });

    chrome.storage.local.set({
	mateEditorSettings: JSON.stringify({
	    fontsize: "14px",
	    mode: "text/x-c++src",
	    autoCloseBrackets: false,
	    theme: 'monokai',
	    lineWrapping: true,
	    keyMap: 'default',
	    lineNumbers: true,
	    cursorBlinkRate: 0,
	    indentUnit: 4,
	    matchBrackets: true,
	    extraKeys: {
		"Ctrl-m": "toggleComment"
	    }
	})
    }, function() {
	console.log("Initialized mate editor settings");
    });
});
