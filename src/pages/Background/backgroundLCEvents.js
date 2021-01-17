export const Test = () => {console.log("backlcevents loaded")};

chrome.runtime.onInstalled.addListener(function () {
    

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    if (isMac) {
	console.log('[init] mac os detected, will install mac keybinding')
    }
    
    chrome.storage.local.set({
	leetcodeEditorSettings: JSON.stringify({
	    editor: {
		autoCloseBrackets: true,
		blinkingCursor: true
	    },
	    keybinding: {
		toggleSubmissionPane: {
		    mod1: isMac ? 'Meta' : 'Alt',
		    mod2: 'None',
		    key: 'i'
		},
		toggleMateEditor: {
		    mod1: isMac ? 'Meta' : 'Alt',
		    mod2: 'None',
		    key: 'k'
		},
		submit: {
		    mod1: 'Ctrl',
		    mod2: 'Enter',
		    key: ''
		},
		test: {
		    mod1: isMac ? 'Meta' : 'Alt',
		    mod2: 'Enter',
		    key: ''
		}
	    }
	}),
    }, function() {
	console.log('[init] Initialized default settings');
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


chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
	// read changeInfo data and do something with it
	// like send the new url to contentscripts.js
	if (changeInfo.url) {
	    chrome.tabs.sendMessage( tabId, {
		message: "HANDLE_URL_CHANGE",
		url: changeInfo.url
	    })
	    chrome.tabs.sendMessage( tabId, {
		message: "HANDLE_URL_CHANGE_MONACO",
		url: changeInfo.url
	    })
	}
    }
);
