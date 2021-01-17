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
    
    const data = {
	data_input: testInput,
	lang: lang,
	question_id: task.question_id,
	typed_code: code
    };
    const submitURL = "/problems/" + task.question_slug + "/interpret_solution/";
    
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
