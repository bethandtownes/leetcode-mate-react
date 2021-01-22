export const Test = () => {console.log("backlcevents loaded")};


import {readSession} from "../../lib/sessions.jsx"

chrome.runtime.onInstalled.addListener(function () {
    
    console.log("installed");
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    if (isMac) {
	console.log('[init] mac os detected, will install mac keybinding')
    }
    
    chrome.storage.local.set({
	leetcodeEditorSettings: JSON.stringify({
	    editor: {
		autoCloseBrackets: true,
		blinkingCursor: true,
		hide: false
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
	    theme: 'monokai-mate',
	    styleActiveLine: true,
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

    const TOTAL_PROBLEM_CAP = 2500;
    
    for (let i = 1; i <= 2500; ++i) {
	const pid = 'p' + i.toString();
	chrome.storage.local.set({
	    [pid]: JSON.stringify({
		code: {
		    cpp: "",
		    c: "",
		    java: "",
		    python: "",
		    python3: "",
		    javascript: "",
		    typescript: "",
		    scala: "",
		    kotlin: "",
		    swift: "",
		    rust: "",
		    php: "",
		    golang: ""
		},
		marked: {
		    cpp: [],
		    c: [],
		    java: [],
		    python: [],
		    python3: [],
		    javascript: [],
		    typescript: [],
		    scala: [],
		    kotlin: [],
		    swift: [],
		    rust: [],
		    php: [],
		    golang: []
		},
		failed_case: []
	    })
	}, function() {
	    if (i % 200 == 0) {
		console.log("initialized problem files: [" + i.toString() + "/" + TOTAL_PROBLEM_CAP.toString() +"]" );
	    }
	});
    }
    
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


async function updateSessionCode(data) {
    const newSession = await readSession(data.pid);
    newSession["code"][data.lang] = data.code;
    const res =  await new Promise((resolve, fail) => {
	chrome.storage.local.set( {
	    ['p' + data.pid.toString()]: JSON.stringify(newSession)
	}, () => resolve({'status': "SUCCESS!"}));
    });
    return res;
}


async function updateTestCase(data) {
    if (data.input.length == 0 || data.expected.length == 0 || data.input == undefined || data.expected == undefined) {
	return "no update";
    }
    console.log('found new case');
    const newSession = await readSession(data.pid);
    const newCase = data.input + ">SPLIT1@2@3SPLIT<" + data.expected;
    if (newSession.failed_case.some((x) => x == newCase)) {
	return "duplicate, no update";
    }
    else {
	newSession["failed_case"].push(newCase);
	/* newSession["failed_case"] = Array.from(new Set(newSession["failed_case"])); */
	const res =  await new Promise((resolve, fail) => {
	    chrome.storage.local.set( {
		['p' + data.pid.toString()]: JSON.stringify(newSession)
	    }, () => resolve({'status': "TEST CASE UPDATED!"}));
	});
	return res;
    }
}



async function updateSession(pid, newSession, msg) {
    const res =  await new Promise((resolve, fail) => {
	chrome.storage.local.set( {
	    ['p' + pid.toString()]: JSON.stringify(newSession)
	}, () => resolve({'status': msg}));
    });
    return res;
}




async function editCase(data) {
    const newSession = await readSession(data.pid);
    const newCase = data.input + ">SPLIT1@2@3SPLIT<" + data.expected;
    newSession["failed_case"][data.index] = newCase;
    const status = await updateSession(data.pid, newSession, "CASE EDITED");
    return status;
}

async function insertNewCase(data) {
    const newSession = await readSession(data.pid);
    const newCase = ">SPLIT1@2@3SPLIT<";
    newSession["failed_case"].push(newCase);
    const status = await updateSession(data.pid, newSession, "CASE INSERTED");
    return status;
}

async function removeTestCase(data) {
    const newSession = await readSession(data.pid);
    if (newSession["failed_case"].length == 0) {
	return "empty no remove";
    }

    newSession["failed_case"].splice(data.index, 1);
    const res =  await new Promise((resolve, fail) => {
	chrome.storage.local.set( {
	    ['p' + data.pid.toString()]: JSON.stringify(newSession)
	}, () => resolve({'status': "TEST CASE REMOVED!"}));
    });
    return res;
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
	if (request.action == "SESSION_REMOVE_TESTCASE") {
	    removeTestCase(request.payload).then((res) => { console.log(res); sendResponse(res)});
	    return true;
	}
	return true;
    }
);


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
	if (request.action == "SESSION_INSERT_TESTCASE") {
	    insertNewCase(request.payload).then((res) => { console.log(res); sendResponse(res)});
	    return true;
	}
	return true;
    }
);



chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
	if (request.action == "SESSION_EDIT_TESTCASE") {
	    editCase(request.payload).then((res) => { console.log(res); sendResponse(res)});
	    return true;
	}
	return true;
    }
);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
	if (request.action == "SESSION_UPDATE_CODE") {
	    updateSessionCode(request.payload).then((res) => {console.log(res); sendResponse(res)});
	    return true;
	}
	return true;
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
	if (request.action == "SESSION_UPDATE_TESTCASE") {
	    updateTestCase(request.payload).then((res) => {console.log(res); sendResponse(res)});
	    return true;
	}
	return true;
    }
);





