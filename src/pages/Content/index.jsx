import React from 'react';
import ReactDOM from 'react-dom';

const viewport = document.getElementById('app');
const app = document.createElement('div');

app.id = 'root';

if (viewport) viewport.prepend(app);

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Draggable from 'react-draggable'

import { useReducer, useRef, useEffect } from 'react';


import { DEBUG } from "../../lib/debug.js";
import { injectJSListener } from "../../lib/utils.jsx";

import * as acquire from "../../lib/acquire.js";
import { submit, runtest } from "../../lib/action.js";
import {T, ResultType, TaskType } from "../../lib/typings.js";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, CssBaseline } from "@material-ui/core";

import ContentViewSubmitOrAccepted from "./modules/ContentViewSubmitOrAccepted.jsx";
import { ContentViewDefault }  from "./modules/ContentViewDefault.jsx";

injectJSListener();


const PaperComponent = (props: PaperProps) => {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper style = {{backgroundColor: "rgba(0,0,0,0.3)"}} {...props} />
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
    msg_debug: null
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
		msg_compile_error: state.msg_compile_error,
		msg_runtime_error: state.msg_runtime_error,
		msg_debug: state.msg_debug,
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

function LeetCodeMateSubmissionPanel(props) {
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState(null);
    const [barPos, setBarPos] = React.useState(220);
    const [value, setValue] = React.useState(0);
    const [row, setRow] = React.useState(10);
    const [judge, setJudge] = React.useState(false);
    
    const textRef = useRef();
    const barRef = useRef();
    const inputBoxRef = useRef();
    const submitButtonRef = useRef();
    const runButtonRef = useRef();
    const runDefaultButtonRef = useRef();
    

    const [state, dispatch] = useReducer(reducer, initialState);

    const onInputChange = (e) => {
	dispatch({type: T.action.update_input, payload: e.target.value});
    };
    
    useEffect(() => {
	const memorizeBarPos = () => {
	    try {
		if (open) {
		    setBarPos(barRef.current.clientWidth);
		}
	    }
	    catch (e) {
		// do nothing
	    }
	};
	window.addEventListener('click', memorizeBarPos);
	return () => {
	    window.removeEventListener('click', memorizeBarPos);
	}
    });

    const focusInput = () => {
	if (textRef.current != null || textRef.current != undefined) {
	    textRef.current.focus();
	}
    };

    useEffect(() => {
	if (open && state.result_status != T.result.accepted) {
	    focusInput();
	}
    }, [state, open]);


    useEffect(() => {
	const toggle = (e) => {
	    if (e.altKey && e.key == 'i') {
		if (open) {
		    if (!judge && state.result_status != T.result.accepted) {
			dispatch({type: T.action.update_input, payload: textRef.current.value});
		    }
		    setOpen(false);
		}
		else {
		    setOpen(true);
		    focusInput();
		}
	    }
	    if (e.ctrlKey && e.key == 'Enter') {
		if (open == false) {
		    setOpen(true);
		}
		if (judge) return;
		submitButtonRef.current.click();
	    }
	    if (e.altKey && e.key == 'Enter') {
		if (open == false) {
		    setOpen(true);
		}
		if (judge) return;
		if (textRef.current == null || textRef.current.value.trim() == "") {
		    runDefaultButtonRef.current.click();
		}
		else {
		    runButtonRef.current.click();
		}
	    }
	    if (e.altKey && e.ctrlKey && e.key == 'Enter') {
		if (judge) return;
		if (open == false) {
		    setOpen(true);
		}
		runDefaultButtonRef.current.click();
	    }
	};
	window.addEventListener('keydown', toggle);
	return () => {
	    window.removeEventListener('keydown', toggle);
	}
    });

    const handleClickOpen = () => {
	if (open == false) {
            setOpen(true)
	}
	else {
	    setOpen(false);
	}
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (event, newValue) => {
	const v = textRef.current.value;
        setValue(newValue);
	dispatch({ type: T.action.update_input, payload: textRef.current.value });
    };


    const updateMessagePaneTabStatus = (res) => {
	if (res.result_status == T.result.compile_error) {
	    setValue(1);
	}
	else if (res.result_status == T.result.runtime_error) {
	    setValue(1);
	}
	else {
	    setValue(0);
	}
    };


    const Actions = () => {	
	const handleRunCustom = async () => {
	    if (state.result_status == T.result.accepted) {
		setMode(T.mode.test);
		dispatch({ type: T.action.reinitialize });
		return;
	    }
	    if (textRef.current == null || textRef.current == undefined || textRef.current.value.trim() == "") {
		return;
	    }
	    
	    dispatch({ type: T.action.update_input, payload: textRef.current.value });
	    setMode(T.mode.test); 
	    setJudge(true);
	    const inputTextCase = textRef.current.value.trim();
	    let res = await runtest(inputTextCase); res.input = inputTextCase;
	    setOpen(true);
	    dispatch({ type: T.action.update, payload: res });
	    setJudge(false);
	    updateMessagePaneTabStatus(res);
	};

	const handleSubmit = async () => {
	    dispatch({ type: T.action.update_input, payload: "" });
	    setMode(T.mode.submit);
	    setJudge(true);
	    const res = await submit(state);
	    dispatch({type: T.action.update, payload: res});
	    setJudge(false);
	    updateMessagePaneTabStatus(res);

	};

	const handleRunDefault = async () => {
	    if (state.result_status == T.result.accepted) {
		setMode(T.mode.test);
	    }
	    const defaultCase = await acquire.DefaultTestCase();
	    textRef.current.value = defaultCase;
	    dispatch({ type: T.action.update_input, payload: textRef.current.value });
	    setMode(T.mode.test); 
	    setJudge(true);
	    let res = await runtest(textRef.current.value.trim());
	    setOpen(true);
	    res.input = defaultCase;
	    dispatch({ type: T.action.update, payload: res });
	    setJudge(false);
	    updateMessagePaneTabStatus(res);
	};
	
	const handleButtonClose = () => {
	    if (open) {
		if (!judge && state.result_status != T.result.accepted) {
		    dispatch({type: T.action.update_input, payload: textRef.current.value});
		}
		if (judge) {
		    dispatch({type: T.action.update_input, payload: textRef.current.value});
		}
		setOpen(false);
	    }
	};

	const handleReset = () => {
	    dispatch({ type: T.action.reinitialize });
	}

        return (
            <>
		<ThemeProvider theme={theme}>
		    <Button ref = { runDefaultButtonRef } onClick =  { handleRunDefault } disabled = { judge } color="primary"> Run Default </Button>
		    <Button ref = { runButtonRef } onClick = { handleRunCustom } disabled = { judge } color="primary"> Run </Button>
		    <Button ref = { submitButtonRef } onClick = { handleSubmit } disabled = { judge } color="primary"> Submit </Button>
		    <Button onClick = { handleButtonClose } color="primary"> Close </Button>
		    <Button onClick = { handleReset } disabled = { false } color="primary"> Reset </Button>
		</ThemeProvider>
            </>
        );
    };


    const MiddleContent = () => {
	if ((mode == T.mode.submit && judge == true) || (state.result_status == T.result.accepted && mode == T.mode.submit)) {
	    return (
		<ContentViewSubmitOrAccepted loading = { judge } state = { state } mode = { mode } />
	    );
	}
	else {
	    return (
		<ContentViewDefault loading = { judge } state = { state } mode = { mode }
		                    barPos = { barPos } barRef = {barRef}
		                    inputRef = { textRef }
		                    tabID = { value } handleTabChange = { handleChange }
	        />
	    );
	}
    }
    return (
        <div>
	    {open && (
		<Dialog
		    id={"submission_pane"}
		    open={true}
		    /* BackdropComponent = {document} */
		    hideBackdrop = {true}
		    disableAutoFocus = {true}
		    disableEnforceFocus
		    style={{ pointerEvents: 'none'}}  
		    disableBackdropClick = {true}
		    onClose={handleClose}
		    maxWidth={false}
		    PaperComponent={PaperComponent}
		    PaperProps={{ style: {backgroundColor: 'rgba(0,0,0,0.6)', pointerEvents: 'auto'}}}
		    aria-labelledby="draggable-dialog-title"
		>
		    <MiddleContent />
		    <DialogActions >
			<Actions />
		    </DialogActions>
		</Dialog>
	    )}
        </div>
    );
}


ReactDOM.render(<LeetCodeMateSubmissionPanel />, document.getElementById('root'));
