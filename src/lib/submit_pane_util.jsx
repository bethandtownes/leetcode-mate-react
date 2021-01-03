/* return { task_type: null,
 * 	 result_status: null,
 * 	 input: null,
 * 	 output: null,
 * 	 expected: null,
 * 	 msg_compile_error: null,
 * 	 msg_runtime_error: null,
 * 	 msg_debug: null
 * }; */

import { ResultType, TaskType } from "./typings.js"

export const makeDisplayState = async (prevState, submitResult) => {
    switch (submitResult.status_msg) {
	case 'Compile Error': {
	    console.log('got compiled error');
	    return {
		task_type: TaskType.submit,
		result_status: ResultType.compile_error,
		input: prevState.input,
		output: prevState.output,
		expected: prevState.expected,
		msg_compile_error: submitResult.full_compile_error,
		msg_runtime_error: null,
		msg_debug: null
	    };
	}
	default: {
	    return prevState;
	}

    }
    return null;
};


