import * as acquire from "./acquire.js";
import { DEBUG }  from "./debug.js";
import * as UtilSubmissionPane from "./submit_pane_util.jsx";

import { isCN } from "./acquire.js";


export async function submitCN(prevState, task) {
    /* const task = await acquire.TaskInfoCN(); */
    const data = {
	lang: acquire.ProgrammingLanguageCN(),
	questionSlug: task.question_title_slug,
	question_id: task.question_id,
	test_judger: "",
	test_mode: false,
	typed_code: await acquire.EditorValue(), 
    };

    const submitURL = "/problems/" + task.question_slug + "/submit/";
    
    return makeSubmitRequestCN(data, submitURL).then(res => {
	return res.json();
    }).catch((e) => {
	throw new EvalError();
    }).then( res => {
	return acquire.SubmissionDetailCN(res['submission_id']);
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

async function makeSubmitRequestCN(task, submitURL) {
    return fetch(submitURL, { 
        method: "POST",
        headers: acquire.RequestHeaderCN(),
        credentials: 'same-origin',
        body: JSON.stringify(task)
    });
};
