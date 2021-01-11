import { DEBUG } from "./debug.js";
import { make_slug } from "./utils.jsx";

import { T } from "./typings.js";


const LANG_CODEMAP = {
    "C++": "cpp",
    "Java": "java",
    "Python": "python",
    "Python3": "python3",
    "C": "c",
    "C#": "csharp",
    "JavaScript": "javascript",
    "TypeScript": "typescript",
    "Ruby": "ruby",
    "Swift": "swift",
    "Go": "go",
    "Scala": "scala",
    "Kotlin": "kotlin",
    "Rust": "rust",
    "PHP": "php"
};


export async function LeetCodeEditorSettings() {
    const p = new Promise((resolve, fail) => {
	chrome.storage.local.get(['leetcodeEditorSettings'], function(result) {
	    console.log("result");
	    console.log(result);

	    resolve(JSON.parse(result.leetcodeEditorSettings));
	})
    }).catch((e) => {
	return undefined;
    });
    const r = await p;
    return r;
}


async function QuestionID(slug) {
    var cache = chrome.runtime.getURL("./cache.json");
    DEBUG("loading question_id from slug")
    return fetch(cache,
	  {method: "GET",
	   credentials: 'same-origin'}
	 ).then(res => {
	     return res.json();
	 }).then(res => {
	     DEBUG(res);
	     return res[slug].question_id;
	 });
}

async function QuestionIDCN(slug) {
    var cache = chrome.runtime.getURL("./cache_cn.json");
    return fetch(cache,
	  {method: "GET",
	   credentials: 'same-origin'}
	 ).then(res => {
	     return res.json();
	 }).then(res => {
	     DEBUG(res);
	     return res[slug].question_id;
	 });
}

export const ProgrammingLanguage = () => {
    if (isCN()) {
	return ProgrammingLanguageCN();
    }
    DEBUG("PL");
    let match = document.getElementsByClassName("ant-select-selection ant-select-selection--single");
    DEBUG(match);
    for (let i = 0; i < match.length; ++i) {
	let e = match[i];
	DEBUG(e);
	DEBUG(e);
	if (e.dataset.cy != undefined && e.dataset.cy == "lang-select") {
	    const lang = e.children[0].innerText.trim();
	    DEBUG("language detected: " + lang);
	    return LANG_CODEMAP[lang];
	}
    }
    DEBUG("called: use default language: " + "cpp")
    return "cpp";
};

export const ProgrammingLanguageCN = () => {
    try {
	return LANG_CODEMAP[document.getElementsByClassName("css-177i07p-BaseButtonComponent ery7n2v0")[0].textContent];
    }
    catch(e) {
	return "cpp";
    }
};


export const CurrentRunStatus = async (id) => {
    let requestURL = "https://leetcode.com/submissions/detail/" + id + "/check";
    var curst = fetch(requestURL, {
	method: "GET",
	credentials: 'same-origin'
    }).then(res => { return res.json()}).then(res => { return res;}); 
    return curst;
};


export const SubmissionDetail = async (id) => {
    let requestURL = "https://leetcode.com/submissions/detail/" + id + "/check";
    for (let i = 0; i < 50; ++i) {
	const curst = await CurrentRunStatus(id);
	if (curst['state'] == "SUCCESS") {
            return curst; 
            break;
	}
    }
    return null;
};

export const CurrentRunStatusCN = async (id) => {
    let requestURL = "https://leetcode-cn.com/submissions/detail/" + id + "/check";
    var curst = fetch(requestURL, {
	method: "GET",
	credentials: 'same-origin'
    }).then(res => {
	console.log(res);
	return res.json()})
      .then(res => {
	  return res;
      }); 
    return curst;    
};


export const SubmissionDetailCN = async (id) => {
    let requestURL = "https://leetcode-cn.com/submissions/detail/" + id + "/check";
    for (let i = 0; i < 50; ++i) {
	const curst = await CurrentRunStatusCN(id);
	console.log("curst");
	console.log(curst);
	
	if (curst['state'] == "SUCCESS") {
            return curst; 
            break;
	}
    }
    return null;
};

export const TaskInfo = async () =>{
    let info_banner;
    for (let i = 0; i < 40; i++) {
	const banner = await new Promise((resolve, fail) => {
	    setTimeout(() => {
		resolve(document.getElementsByClassName("css-v3d350")[0]);
	    }, 400)}
	);
	if (banner != undefined) {
	    info_banner = banner;
	    break;
	}
    }
    const info = info_banner.innerText.split('.');
    const slug = make_slug(info[1]);
    const id = await QuestionID(slug);
    return {
	question_id : id,
	question_title_slug: slug
    };
}


export const TaskInfoCN = async () => {
    let elm;
    for (let i = 0; i < 40; ++i) {
	const banner = await new Promise((resolve, faile) => {
	    setTimeout(()=> {
		resolve(document.getElementsByClassName("css-10c1h40-Title eugt34i1")[0]);
	    }, 400);
	});
	if (banner != undefined) {
	    elm = banner;
	    break;
	}
    }
    const elmHref = elm.getElementsByTagName('a')[0].href;
    const regex = /(?<=problems\/)(.*)?(?=\/)/g;    
    const slug = elmHref.match(regex)[0];
    const id = await QuestionIDCN(slug);
    return {
	question_id : id,
	question_title_slug: slug
    };
};


export const Csrftoken = () => {
    try {
	return document.cookie.split(';').map(x => x.trim()).filter(x => x.startsWith("csrf"))[0].split('=')[1];
    }
    catch {
	alert("no csrftoken");
	return "NULLSTRING";
    }
};

export const RequestHeader = () => {
    return {
	'authority': 'leetcode.com',
	'accept': '*/*',
	'accept-encoding': 'gzip, deflate, br', 
	'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
	'content-type': 'application/json',
	'origin': 'https://leetcode.com',
	'sec-fetch-dest': 'empty',
	'sec-fetch-mode': 'cors',
	'sec-fetch-site': 'same-origin',
	'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
	'x-csrftoken': Csrftoken()
    }
};


export const RequestHeaderCN = () => {
    return {
	'authority': 'leetcode-cn.com',
	'accept': '*/*',
	'accept-encoding': 'gzip, deflate, br', 
	'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6',
	'content-type': 'application/json',
	'origin': 'https://leetcode-cn.com',
	'sec-fetch-dest': 'empty',
	'sec-fetch-mode': 'cors',
	'sec-fetch-site': 'same-origin',
	'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
	'x-csrftoken': Csrftoken()
    }
};


export async function EditorValue(waitTime = 200, attempt = 1) {
    if (attempt > 3) {
	DEBUG("maxout 3 attempts, no value accquired");
	return null;
    }
    async function makeAttempt() {
	let result = null;
	function handleEditorValue(event) {
	    if(event.data.action === 'EDITOR_VALUE') {
		result = event.data.payout;
	    }
	}
	window.addEventListener("message", handleEditorValue, false);

	let event = new CustomEvent('EDITOR_GRAB');
	window.dispatchEvent(event);
	var promise = new Promise((resolve, fail) => {
	    setTimeout(() => {
		DEBUG("received value and remove listener");
		window.removeEventListener("message", handleEditorValue, false);
		DEBUG("eventListener[message, handleEditorvalue] removed");
		resolve(result);
	    }, waitTime)
	});
	return promise;
    }
    const a = await makeAttempt();
    if (a == null) {
	DEBUG("NULL received");
	return getEditorValue(waitTime + 200, attempt + 1);
    }
    else {
	return a;
    }
};


/* 
 * const GET_CONSOLE_BUTTON = () {
 *     if (isCN()) {
 * 	return "custom-testcase__2YgB";
 *     }
 *     else {
 * 	return "custom-testcase__2ah7";
 *     }
 * };
 *  */

/* const CONSOLE_PANE =  */

export function isCN() {
    return document.getElementsByClassName("css-19dbiou-HomeWrapper e1925exm1")[0] != undefined;
}


export async function DefaultTestCaseCN() {
    const LOCATOR_CONSOLE_BUTTON = "custom-testcase__2ah7";
    const LOCATOR_CONSOLE_PANE = "result__1UhQ";
    const LOCATOR_TESTCASE_EDITOR = " ace_editor ace-github testcase-editor__3Tbb";

    function testcaseEditor() {
	return document.getElementsByClassName("testcase-editor__lA_R")[0];
    }

    function consoleButton() {
	return document.getElementsByClassName("custom-testcase__2YgB")[0];
    }

    function consolePane() {
	return document.getElementsByClassName("panel__2jUF closable__1NwJ")[0];
    }
    
    const getDefaultTestCase = () => {
	return testcaseEditor().value;
    };
    
    const consolePaneAlreadyOpened = testcaseEditor() != undefined;

    if (consolePaneAlreadyOpened == false) {
	consoleButton().click();
	consolePane().style.display = "none"
    }

    return new Promise((resolve, fail) => {
	setTimeout(() => {
	    resolve(getDefaultTestCase());
	}, 500)
    }).then((res) => {
	if (consolePaneAlreadyOpened == false) {
	    consolePane().style.display = ""
	    consoleButton().click();
	}
	return res;
    });
};



export async function DefaultTestCase() {
    const CN = isCN();
    const LOCATOR_CONSOLE_BUTTON = "custom-testcase__2ah7";
    const LOCATOR_CONSOLE_PANE = "result__1UhQ";
    const LOCATOR_TESTCASE_EDITOR = " ace_editor ace-github testcase-editor__3Tbb";

    function testcaseEditor() {
	if (CN) {
	    return document.getElementsByClassName("testcase-editor__lA_R")[0];
	}
	else {
	    return document.getElementsByClassName(LOCATOR_TESTCASE_EDITOR)[0]
	}
    }

    function consoleButton() {
	if (CN) {
	    return document.getElementsByClassName("custom-testcase__2YgB")[0];
	}
	else {
	    return document.getElementsByClassName(LOCATOR_CONSOLE_BUTTON)[0];
	}
    }

    function consolePane() {
	if (CN) {
	    return document.getElementsByClassName("panel__2jUF closable__1NwJ")[0];
	}
	else {
	    return document.getElementsByClassName(LOCATOR_CONSOLE_PANE)[0];
	}
    }

    function maskConsolePane() {
	consolePane().style.height = "0px"
    }

    function unmaskConsolePane() {
	consolePane().style.height = "inherit";
    }

    
    const getDefaultTestCase = () => {
	if (CN) {
	    return testcaseEditor().value;
	}
	else {
	    const e = document.getElementsByClassName("ace_layer ace_text-layer")[0];
	    if (e == undefined) {
		return;
	    }
	    return Array.from(e.children).map(x => x.textContent).join('\n')
	}
    };
    
    const consolePaneAlreadyOpened = testcaseEditor() != undefined;

    if (CN == true) {
	if (consolePaneAlreadyOpened == false) {
	    consoleButton().click();
	    consolePane().style.display = "none"
	}

	return new Promise((resolve, fail) => {
	    setTimeout(() => {
		resolve(getDefaultTestCase());
	    }, 500)
	}).then((res) => {
	    if (consolePaneAlreadyOpened == false) {
		consolePane().style.display = ""
		consoleButton().click();
	    }
	    return res;
	});
    }
    else {
	if (consolePaneAlreadyOpened == false) {
	    maskConsolePane();	
	    consoleButton().click();
	    consolePane().style.display = "none"
	}

	return new Promise((resolve, fail) => {
	    setTimeout(() => {
		resolve(getDefaultTestCase());
	    }, 100)
	}).then((res) => {
	    if (consolePaneAlreadyOpened == false) {
		consoleButton().click();
		setTimeout(() => {
		    consolePane().style.display = "";
		    consolePane().style.height = "inherit";
		}, 200);
	    }
	    return res;
	});
    }
};


export const DebugPrint = (mode, result) => {
    switch (mode) {
	case T.task_type.run_testcase : {
	    if (typeof(result.code_output) == "string") {
		return result.code_output;
	    }
	    else {
		return result.code_output.join('\n');
	    }
	}
	default: {
	    return null;
	}
    }
    
};
