import * as acquire from "./acquire.js";
import { DEBUG }  from "./debug.js"
import * as UtilSubmissionPane from "./submit_pane_util.jsx";


export async function submit() {
    DEBUG("submit called");
    const task = await acquire.TaskInfo();
    const data = {
	lang: acquire.ProgrammingLanguage(),
	question_id: task.question_id,
	typed_code: await acquire.EditorValue(), 
    };
    const submitURL = "/problems/" + task.question_slug + "/submit/";
    
    return makeSubmitRequest(data, submitURL).then(res => {
	return res.json();
    }).then( res => {
	return acquire.SubmissionDetail(res['submission_id']);
    }).then( res => {
	/* console.log(res); */
	return UtilSubmissionPane.makeDisplayState(res);
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

