import {T, ResultType, TaskType } from "./typings.js";

import * as acquire from "./acquire.js";

const makeComparison = (result) => {
    if (result.code_answer.join('/n') != result.expected_code_answer.join('/n')) {
	return "Test Didn't Pass";
    }
    else {
	return "Test Passed";
    }
};

const makeComparisonCN = (expected, result) => {
    if (expected.code_answer.join('/n') != result.code_answer.join('/n')) {
	return "Test Didn't Pass";
    }
    else {
	return "Test Passed";
    }
};

export const makeTestDisplayStateCN = async (expected_p, result_p) => {
    const expected = await expected_p;
    const result = await result_p;
    switch (result.status_msg) {
	    case 'Compile Error': {
	    return {
		result_status: T.result.compile_error,
		input: null,
		output: null,
		expected: null,
		msg_compile_error: result.full_compile_error,
		msg_runtime_error: null,
		msg_debug: null
	    };
	}
	case 'Accepted': {
	    return {
		result_status: makeComparisonCN(result, expected),
		input: null,
		output: result.code_answer,
		expected: expected.code_answer,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	case 'Time Limit Exceeded': {
	    return {
		result_status: T.result.time_limit_exceeded,
		input: null,
		output: result.code_answer,
		expected: expected.code_answer,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	case 'Memory Limit Exceeded': {
	    return {
		result_status: T.result.memory_limit_exceeded,
		input: null,
		output: result.code_answer,
		expected: expected.code_answer,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	case 'Runtime Error': {
	    return {
		result_status: T.result.runtime_error,
		input: null,
		output: result.code_answer,
		expected: null,
		msg_compile_error: null,
		msg_runtime_error: result.full_runtime_error,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	default: {
	    return null;
	}
    };
}



export const makeTestDisplayState = async (result) => {
    switch (result.status_msg) {
	case 'Compile Error': {
	    return {
		result_status: T.result.compile_error,
		input: null,
		output: null,
		expected: null,
		msg_compile_error: result.full_compile_error,
		msg_runtime_error: null,
		msg_debug: null
	    };
	}
	case 'Accepted': {
	    return {
		result_status: makeComparison(result),
		input: null,
		output: result.code_answer,
		expected: result.expected_code_answer,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	case 'Time Limit Exceeded': {
	    return {
		result_status: T.result.time_limit_exceeded,
		input: null,
		output: result.code_answer,
		expected: result.expected_code_answer,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	case 'Memory Limit Exceeded': {
	    return {
		result_status: T.result.memory_limit_exceeded,
		input: null,
		output: result.code_answer,
		expected: result.expected_code_answer,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	case 'Runtime Error': {
	    return {
		result_status: T.result.runtime_error,
		input: null,
		output: result.code_answer,
		expected: null,
		msg_compile_error: null,
		msg_runtime_error: result.full_runtime_error,
		msg_debug: acquire.DebugPrint(T.task_type.run_testcase, result)
	    };
	}
	default: {
	    return null;
	}
    };
}

export const makeDisplayState = async (prevState, submitResult) => {
    switch (submitResult.status_msg) {
	case 'Compile Error': {
	    return {
		result_status: ResultType.compile_error,
		input: null,
		output: null,
		expected: null,
		msg_compile_error: submitResult.full_compile_error,
		msg_runtime_error: null,
		msg_debug: null
	    };
	}
	case 'Wrong Answer': {
	    const A = submitResult.total_correct.toString();
	    const B = submitResult.total_testcases.toString();
	    return {
		result_status: ResultType.wrong_answer,
		input: submitResult.input,
		output: submitResult.code_output,
		expected: submitResult.expected_output,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: submitResult.std_output,
		total_correct: submitResult.total_correct,
		total_testcases: submitResult.total_testcases
	    };
	}
	case 'Accepted': {
	    return {
		result_status: ResultType.accepted,
		input: null,
		output: null,
		expected: null,
		runtime_percentile: submitResult.runtime_percentile,
		memory_percentile: submitResult.memory_percentile,
		status_memory: submitResult.status_memory,
		status_runtime: submitResult.status_runtime,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: null
	    };
	}
	case 'Runtime Error': {
	    const A = submitResult.total_correct.toString();
	    const B = submitResult.total_testcases.toString();
	    return {
		result_status: ResultType.runtime_error,
		input: submitResult.last_testcase,
		output: null,
		expected: submitResult.expected_output,
		msg_compile_error: null,
		msg_runtime_error: submitResult.full_runtime_error,
		msg_debug: submitResult.std_output,
		total_correct: submitResult.total_correct,
		total_testcases: submitResult.total_testcases
	    };
	}
	case 'Memory Limit Exceeded': {
	    return {
		result_status: ResultType.memory_limit_exceeded,
		input: submitResult.input,
		output: submitResult.code_output,
		expected: submitResult.expected_output,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: null,
		total_correct: submitResult.total_correct,
		total_testcases: submitResult.total_testcases
	    };
	}
	case 'Time Limit Exceeded': {
	    const A = submitResult.total_correct.toString();
	    const B = submitResult.total_testcases.toString();
	    return {
		result_status: ResultType.time_limit_exceeded,
		input: submitResult.input,
		output: submitResult.code_output,
		expected: submitResult.expected_output,
		msg_compile_error: null,
		msg_runtime_error: null,
		msg_debug: submitResult.std_output,
		total_correct: submitResult.total_correct,
		total_testcases: submitResult.total_testcases
	    };
	}
	default: {
	    return prevState;
	}

    }
    return null;
};


