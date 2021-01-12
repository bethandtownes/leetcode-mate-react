chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({
	leetcodeEditorSettings: JSON.stringify({
	    bracketMatching: true,
	    blinkingCursor: true
	}),
    }, function() {
	console.log('Initialized default settings');
    });
});
