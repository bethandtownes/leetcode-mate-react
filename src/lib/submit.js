import * as acquire from "./acquire.js";
import { DEBUG }  from "./debug.js";
import * as UtilSubmissionPane from "./submit_pane_util.jsx";

import { isCN } from "./acquire.js";



export async function submit(prevState, task) {
    /* const task = await acquire.TaskInfo(); */
    const data = {
	lang: acquire.ProgrammingLanguage(),
	question_id: task.question_id,
	typed_code: await acquire.EditorValue(), 
    };
    const submitURL = "/problems/" + task.question_slug + "/submit/";
    
    return makeSubmitRequest(data, submitURL).then(res => {
	return res.json();
    }).catch((e) => {
	throw new EvalError();
    }).then( res => {
	return acquire.SubmissionDetail(res['submission_id']);
    }).then( res => {
	return UtilSubmissionPane.makeDisplayState(prevState, res);
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

