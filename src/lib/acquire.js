import { DEBUG } from "./debug.js";
import { make_slug } from "./utils.jsx";


const LANG_CODEMAP = {
    "C++": "cpp",
    "Java": "java",
    "Python": "python",
    "Python3": "python3",
    "C": "c",
    "C#": "csharp",
    "JavaScript": "javascript",
    "Ruby": "ruby",
    "Swift": "swift",
    "Go": "go",
    "Scala": "scala",
    "Kotlin": "kotlin",
    "Rust": "rust",
    "PHP": "php"
};


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

export const ProgrammingLanguage = () => {
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

export const CurrentRunStatus = async (id) => {
    DEBUG("Cur");
    let requestURL = "https://leetcode.com/submissions/detail/" + id + "/check";
    var curst = fetch(requestURL, {
	method: "GET",
	credentials: 'same-origin'
    }).then(res => { return res.json()}).then(res => { return res;}); 
    return curst;
};

export const SubmissionDetail = async (id) => {
    DEBUG("get submission detail:" + id);
    let requestURL = "https://leetcode.com/submissions/detail/" + id + "/check";
    for (let i = 0; i < 20; ++i) {
	const curst = await CurrentRunStatus(id);
	DEBUG(curst);
	if (curst['state'] == "SUCCESS") {
            return curst; 
            break;
	}
    }
    return null;
};

export const TaskInfo = async () =>{
    const info = document.getElementsByClassName("css-v3d350")[0].innerText.split('.');
    const slug = make_slug(info[1]);
    const id = await QuestionID(slug);
    return {
	question_id : id,
	question_title_slug: slug
    };
}

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
	'referer': 'https://leetcode.com/problems/add-two-numbers/',
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

export const DefaultTestCase = () => {
    const e = document.getElementsByClassName("ace_layer ace_text-layer")[0];
    if (e == undefined) {
	// DEBUG("no text case input area found");
	return;
    }
    return Array.from(e.children).map(x => x.textContent).join('\n')
};
