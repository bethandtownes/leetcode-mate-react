import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import { isCN } from "../../../lib/acquire.js";

import { useReducer, useRef, useEffect } from 'react';
import { ID } from "./utility.js"

import { DEBUG } from "../../../lib/debug.js";
import { injectJSListener } from "../../../lib/utils.jsx";

import * as acquire from "../../../lib/acquire.js";
import { submit, submitCN, runtest, runtestCN } from "../../../lib/action.js";
import {T, ResultType, TaskType } from "../../../lib/typings.js";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, CssBaseline, Typography, Box} from "@material-ui/core";

import ContentViewSubmitOrAccepted from "./ContentViewSubmitOrAccepted.jsx";
import { ContentViewDefault }  from "./ContentViewDefault.jsx";
import DraggableDialog from "./Setting.jsx";
import { MonacoDialog } from "./MonacoEditor.jsx";
import LeetCodeMateSettings from "./LeetCodeMateSettings.jsx";
import { MATE_EDITOR_LANGUAGE } from "./MonacoEditor.jsx";


// to do


const PaperComponent = (props: PaperProps) => {
    const paperProps = Object.fromEntries(Object.entries(props)
						.filter(([k, v]) => k !=  'onStop' && k != 'position' && k != 'onStart'));
    return (
        <Draggable
	    position = {props.position}
	    onStop = {props.onStop}
	    onStart = {props.onStart}
	    onClick = {props.onClick}
            handle="#submitpanelc"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper style = {{backgroundColor: "rgba(0,0,0,0.3)"}} {...paperProps} />
        </Draggable>
    )
}


const initialState = {
    result_status: null,
    input: "",
    output: "",
    expected: "",
    status_runtime: null,
    status_memory: null,
    runtime_percentile: null,
    memory_percentile: null,
    msg_compile_error: "init",
    msg_runtime_error: null,
    msg_debug: null,
    total_correct: null,
    total_testcases: null
};

function reducer(state, action) {
    switch (action.type) {
	case T.action.update: {
	    return action.payload;
	}
	case T.action.update_input: {
	    return {
		result_status: state.result_status,
		input: action.payload,
		output: state.output,
		expected: state.expected,
		status_runtime: state.status_runtime,
		status_memory: state.status_memory,
		runtime_percentile: state.runtime_percentile,
		memory_percentile: state.memory_percentile,
		msg_compile_error: state.msg_compile_error,
		msg_runtime_error: state.msg_runtime_error,
		msg_debug: state.msg_debug,
		total_correct: state.total_correct,
		total_testcases: state.total_testcases
	    };
	}
        case T.action.run_default_case : {
	    return ;
	}
	case T.action.reinitialize: {
	    return initialState;
	}
        default: {
	    return state;
        }
    }
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const theme = createMuiTheme({
    palette: {
 	action: {
 	    disabled: '#bdbdbd'
 	}
    }
});

export function SubmissionPane(props) {
    
    
};
