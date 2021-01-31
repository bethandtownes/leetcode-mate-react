import * as acquire from "./acquire.js";
import { DEBUG }  from "./debug.js"
import * as UtilSubmissionPane from "./submit_pane_util.jsx";


export async function runtest(testInput, task, code = undefined, lang = undefined) {
    if (code == undefined) {
	code = await acquire.EditorValue();
    }

    if (lang == undefined) {
	lang = acquire.ProgrammingLanguage();
    }

    console.log(task);
    
    const data = {
	data_input: testInput,
	lang: lang,
	question_id: task.question_id,
	typed_code: code
    };
    const submitURL = "/problems/" + task.question_title_slug + "/interpret_solution/";
    
    return makeSubmitRequest(data, submitURL).then(res => {
	return res.json();
    }).catch((e) => {
	throw new EvalError();
    }).then( res => {
	return acquire.SubmissionDetail(res['interpret_id']);
    }).then( res => {
	return UtilSubmissionPane.makeTestDisplayState(res);
    }).catch((e) => {
	if (e instanceof EvalError) {
	    return null;
	}
	else {
	    next(e);
	}
    });
}

async function makeSubmitRequest(task, submitURL) {
    return fetch(submitURL, { 
        method: "POST",
        headers: acquire.RequestHeader(),
        credentials: 'same-origin',
        body: JSON.stringify(task)
    });
};




export async function runtestN(testInput, task, code = undefined, lang = undefined, time = 0, maxTry = 10) {
    console.log(testInput);
    console.log("try: " + time);
    if (code == undefined) {
	code = await acquire.EditorValue();
    }

    if (lang == undefined) {
	lang = acquire.ProgrammingLanguage();
    }


    
    const data = {
	data_input: testInput,
	lang: lang,
	question_id: task.data.question.questionId,
	typed_code: code
    };

    console.log(data);
    
    const submitURL = "/problems/" + task.data.question.titleSlug + "/interpret_solution/";
    
    return makeSubmitRequest(data, submitURL).then(res => {
	return res.json();
    }).catch((e) => {
	console.log(e);
	throw new EvalError();
    }).then( res => {
	console.log(res);
	return acquire.SubmissionDetail(res['interpret_id']);
    }).then( res => {
	return UtilSubmissionPane.makeTestDisplayState(res);
    }).catch((e) => {
	if (time == maxTry) {
	    return "unfinished";
	}
	return new Promise((resolve, fail) => {
	    setTimeout(() => resolve(runtestN(testInput, task, code, lang, time + 1)), 800);
	});
    });
};
