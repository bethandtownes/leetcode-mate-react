import * as acquire from "./acquire.js";
import { DEBUG }  from "./debug.js"
import * as UtilSubmissionPane from "./submit_pane_util.jsx";


export async function runtestCN(testInput) {
    const task = await acquire.TaskInfoCN();
    const data = {
	data_input: testInput,
	judge_type: "large",
	lang: acquire.ProgrammingLanguageCN(),
	question_id: task.question_id,
	test_judger: "",
	test_mode: false,
	typed_code: await acquire.EditorValue(), 
    };
    const submitURL = "/problems/" + task.question_slug + "/interpret_solution/";
    
    return makeTestRequestCN(data, submitURL).then(res => {
	return res.json();
    }).catch((e) => {
	throw new EvalError();
    }).then( res => { 
	return [acquire.SubmissionDetailCN(res['interpret_expected_id']), acquire.SubmissionDetailCN(res['interpret_id'])];
    }).then( res => {
	return UtilSubmissionPane.makeTestDisplayStateCN(res[0], res[1]);
    }).catch((e) => {
	if (e instanceof EvalError) {
	    return null;
	}
	else {
	    console.log(e);
	    return null;
	    /* console.log(e);
	       next(e); */
	}
    });
}

async function makeTestRequestCN(task, submitURL) {
    return fetch(submitURL, { 
        method: "POST",
        headers: acquire.RequestHeaderCN(),
        credentials: 'same-origin',
	body: JSON.stringify(task)
	});
};
