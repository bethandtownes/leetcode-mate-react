/* return { task_type: null,
 * 	 result_status: null,
 * 	 input: null,
 * 	 output: null,
 * 	 expected: null,
 * 	 msg_compile_error: null,
 * 	 msg_runtime_error: null,
 * 	 msg_debug: null
 * }; */



import { ResultType, TaskType } from "./typings"

export const makeDisplayState = (prevState, submitResult) => {
    switch (submitResult.status_msg) {
	case 'Compile Error': {
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


//
** at runtime **
call(object, fcn) {
    if (run_time_type_pool.contains(object) == false) {
	throw exception;
    }
    else {
	
	return with_current_context(std::invoke(child_or_LCA(run_time_function_pool[object][fcn])));
    }
}
//
