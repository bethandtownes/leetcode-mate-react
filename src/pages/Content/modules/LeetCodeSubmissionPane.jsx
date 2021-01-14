import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import { isCN } from "../../../lib/acquire.js";

import { useReducer, useRef, useEffect } from 'react';


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


function LeetCodeMate(props) {
    const [open, setOpen] = React.useState(false);
    const [openSetting, setOpenSetting] = React.useState(false);
    const [mode, setMode] = React.useState(null);
    const [barPos, setBarPos] = React.useState(220);
    const [value, setValue] = React.useState(0);
    const [failed, setFail] = React.useState(false);
    const [judge, setJudge] = React.useState(false);
    const [mini, setMini] = React.useState(false);
    const [defaultCase, setDefaultCase] = React.useState(null);
    const [CN, setCN] = React.useState(isCN());
    const [problemSlug, setProblemSlug] = React.useState(null);

    const [taskInfo, setTaskInfo] = React.useState(null)
    
    const [W, setW] = React.useState(800);
    const [H, setH] = React.useState(500);

   
    const textRef = useRef();
    const barRef = useRef();
    const inputBoxRef = useRef();
    const submitButtonRef = useRef();
    const runButtonRef = useRef();
    const runDefaultButtonRef = useRef();
    const monacoRef = useRef();


    const [openMonaco, setOpenMonaco] = React.useState(false);
    const [widthMonaco, setWidthMonaco] = React.useState(600);
    const [heightMonaco, setHeightMonaco] = React.useState(600);
    const [codeMateEditor, setCodeMateEditor] = React.useState("CodeMirror Editor");
    const [settingsMateEditor, setSettingsEditor] = React.useState(
	{
	    mode: 'text/x-c++src',
	    theme: 'material-darker',
	    lineNumbers: true
	}
    );

    const [state, dispatch] = useReducer(reducer, initialState);


    const onInputChange = (e) => {
	dispatch({type: T.action.update_input, payload: e.target.value});
    };

    useEffect(async () => {
	const conf = await acquire.LeetCodeEditorSettings();
	const A =  async () => window.dispatchEvent(new CustomEvent("EDITOR_CONFIG_EVENT", {detail : { action: "INIT", data: conf }}));
	setTimeout(A, 500);
	console.log("set storaged editor config");
    }, []);


    useEffect(async() => {
	setTimeout(async() => {
	    if (CN == false) {
		const p = await acquire.TaskInfo();
		console.log(p);
		setProblemSlug(p);
		const r = await acquire.QuestionDetailStats(p.question_title_slug);
		const inputCase = r.data.question.sampleTestCase;
		setDefaultCase(inputCase);
		setTaskInfo(r);
		console.log(r);
	    }
	    else {
		const p = await acquire.TaskInfoCN();
		setProblemSlug(p);
		const r = await acquire.QuestionDetailStatsCN(p.question_title_slug);
		const inputCase = r.data.question.sampleTestCase;
		setDefaultCase(inputCase);
		setTaskInfo(r);
	    }
	}, 1000);
    }, []);

    
    useEffect(async() => {
	if (failed) {
	    setTimeout(() => { setFail(false) }, 3000);
	}
    }, [failed]);


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
	};
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
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
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
	    if (isMac && e.metaKey && e.key == 'i') {
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
	    

	    if (isMac && e.metaKey && e.key == 'Enter') {
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


    const handleEditorSettingChange = async (e) => {
	console.log(e);
	const newState = {...settingsMateEditor, [e.target.name]: e.target.value };
	console.log(newState);
	setSettingsEditor(newState);
    }

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



    const handleMonacoSubmit = async () => {
	dispatch({ type: T.action.update_input, payload: "" });
	setMode(T.mode.submit);
	setJudge(true);	
	const res = CN == true ? (await submitCN(state, problemSlug)) : (await submit(state, problemSlug, monacoRef.current.editor.getValue(), "cpp"));
	saveMateEditor();
	console.log(res);	
	if (res == null) {
	    handleReset();
	    setFail(true);
	    return;
	}
	dispatch({type: T.action.update, payload: res});
	setJudge(false);
	updateMessagePaneTabStatus(res);
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
	    let res = CN == true ? await runtestCN(inputTextCase, problemSlug) : await runtest(inputTextCase, problemSlug);
	    if (res == null) {
		handleReset();
		setFail(true);
		return;
	    }
	    res.input = inputTextCase;
	    setOpen(true);
	    dispatch({ type: T.action.update, payload: res });
	    setJudge(false);
	    updateMessagePaneTabStatus(res);
	};

	const handleSubmit = async () => {
	    dispatch({ type: T.action.update_input, payload: "" });
	    setMode(T.mode.submit);
	    setJudge(true);
	    
	    const res = CN == true ? await submitCN(state, problemSlug) : await submit(state, problemSlug);
	    console.log(res);
	    
	    if (res == null) {
		handleReset();
		setFail(true);
		return;
	    }
	    dispatch({type: T.action.update, payload: res});
	    setJudge(false);
	    updateMessagePaneTabStatus(res);

	};


	const handleRunDefault = async () => {
	    if (state.result_status == T.result.accepted) {
		setMode(T.mode.test);
	    }
	    if (defaultCase == null) {
		// this could have been avoided but for now it is good
		setDefaultCase(await acquire.DefaultTestCase());
	    }
	    textRef.current.value = defaultCase;
	    dispatch({ type: T.action.update_input, payload: textRef.current.value });
	    setMode(T.mode.test); 
	    setJudge(true);
	    let res = CN == true ? await runtestCN(textRef.current.value.trim(), problemSlug) : await runtest(textRef.current.value.trim(), problemSlug);
	    if (res == null) {
		handleReset();
		setFail(true);
		return;
	    }
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
		setOpen(false);
	    }
	};

	const handleMini = () => {
	    if (mini == false) {
		setW(620);
		setH(300);
		setBarPos(150);
		setMini(true);
	    }
	    else {
		setW(800);
		setH(500);
		setBarPos(220);
		setMini(false);
	    }
	};

	const renderMini = () => {
	    if (mini == true) {
		return "Unminify";
	    }
	    else {
		return "Minify";
	    }
	}

	const handleReset = () => {
	    dispatch({ type: T.action.reinitialize });
	    setMode(null);
	    setJudge(false);
	};

	const handleSetting = () => {
	    setOpenSetting(!openSetting);
	}

	// this s a test button for testing new features.
	const handlePlay = () => {
	    setOpenMonaco(!openMonaco);
	}

        return (
            <>
		<ThemeProvider theme={theme}>
		    <Button 
   			variant = "contained"
			size = "small"
			onClick =  { handlePlay }
			color="primary">
			Play
		    </Button>
		    <Button 
   			variant = "contained"
			size = "small"
			onClick =  { handleSetting }
			color="primary">
			Setting
		    </Button>
		    <Button 
   			variant = "contained"
			size = "small"
			onClick =  { handleMini }
			color="primary">
			{renderMini()}
		    </Button>
		    <Button ref = { runDefaultButtonRef }
   			    variant = "contained"
			    size = "small"
			    onClick =  { handleRunDefault }
			    disabled = { judge || failed } color="primary">
			Run Default
		    </Button>
		    <Button   variant = "contained"
			      size = "small"
			      ref = { runButtonRef } onClick = { handleRunCustom } disabled = { judge || failed } color="primary"> Run </Button>
		    <Button   variant = "contained"
			      size = "small"
			      ref = { submitButtonRef } onClick = { handleSubmit } disabled = { judge || failed } color="primary"> Submit </Button>
		    <Button   variant = "contained"
			      size = "small"
			      onClick = { handleButtonClose } color="primary"> Close </Button>
		    <Button   variant = "contained"
			      size = "small"
			      onClick = { handleReset } disabled = { false } color="primary"> Reset </Button>
		</ThemeProvider>
            </>
        );
    };

    
    const XX = (e, d) => { console.log(e);
	console.log(d);
	setH(d.size.height);
	setW(d.size.width);
    };

    
    const MiddleContent = () => {
	if ((mode == T.mode.submit && judge == true) || (state.result_status == T.result.accepted && mode == T.mode.submit)) {
	    return (
		<ContentViewSubmitOrAccepted loading = { judge }
					     state = { state }
					     mode = { mode } />
	    );
	}
	else {
	    return (
		<ContentViewDefault loading = { judge } state = { state } mode = { mode }
		                    barPos = { barPos } barRef = {barRef}
   		                    H = {H} W = {W} XX = {XX} 
		                    inputRef = { textRef } failed = { failed }
		                    tabID = { value } handleTabChange = { handleChange }
	        />
	    );
	}
    }


    const onResizeMonac = (e, data) => {
	// monacoRef.current.editor.setSize(data.size.width, data.size.height + 4);
	// setWidthMonaco(data.size.width);
	// setHeightMonaco(data.size.height);
    };


    const handleCodeChange = ((editor, data, value) => { });


    const saveMateEditor = () => {
	setCodeMateEditor(monacoRef.current.editor.getValue())
    }
	
    return (
        <div>
	    { (
		  <>
		      <>
			  <Dialog
			      id={"submission_pane"}
			      open={open}
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
			      <Box mb={0.5}>
				  <DialogActions>
				      <Actions />
				  </DialogActions>
			      </Box>
			  </Dialog>
		      </>
		      <>
			  <DraggableDialog open = {openSetting} onClose = {() => {setOpenSetting(false);}}>
			  </DraggableDialog>
		      </>
		      <>
			  <MonacoDialog open = {openMonaco}
			                task = { taskInfo }
					W = {widthMonaco} H = {heightMonaco}
					editorSettings = { settingsMateEditor }
			                onResizeMonoco = {onResizeMonac}
			                onCodeChange = { handleCodeChange }
			                handleSubmit = { handleMonacoSubmit }
			                code = { codeMateEditor }
					handleChange = { handleEditorSettingChange } 
					inputRef = { monacoRef }
					handleClose = {() => {
					    saveMateEditor();
					    setOpenMonaco(false);
					}}
			                theme = { theme }
			  />
		      </>
		  </>
	      )}
        </div>
    );
}

export { LeetCodeMate };
