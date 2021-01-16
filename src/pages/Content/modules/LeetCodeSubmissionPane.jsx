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
import LeetCodeMateSettings from "./LeetCodeMateSettings.jsx";




function checkmod(e, mod) {
    if (mod == "Enter") {
	return e.key == "Enter";
    }
    else if (mod == "Ctrl") {
	return e.ctrlKey;
    }
    else if (mod == "Alt") {
	return e.altKey;
    }
    else if (mod == "Shift") {
	return e.shiftKey;
    }
    else if (mod == "Meta") {
	return e.metaKey;
    }
    else if (mod == "None") {
	return true;
    }
    return false;
}

function checkkey(e, key) {
    if (key.length == 0) {
	return true;
    }
    return e.key == key;
}



function triggers(e, binding) {
    const mod1 = binding.mod1;
    return checkmod(e, binding.mod1) && checkmod(e, binding.mod2) && checkkey(e, binding.key);
}

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

    const [ready, setReady] = React.useState({
	loadedMateEditor: false,
	loadedLeetCodeMateSettings: false,
	loadedTask: true
    });
   
    const textRef = useRef();
    const barRef = useRef();
    const inputBoxRef = useRef();
    const submitButtonRef = useRef();
    const runButtonRef = useRef();
    const runDefaultButtonRef = useRef();
    const monacoRef = useRef();

    const [openMonaco, setOpenMonaco] = React.useState(false);
    const [widthMonaco, setWidthMonaco] = React.useState(600);
    const [heightMonaco, setHeightMonaco] = React.useState(800);
    const [codeMateEditor, setCodeMateEditor] = React.useState("");
    
    const [settingsMateEditor, setSettingsEditor] = React.useState(null);
    const [settingsLeetCodeMate, setSettingLeetCodeMate] = React.useState(null);



    useEffect(async () => {
	const initLeetCodeMateSettings =  await acquire.LeetCodeEditorSettings();
	setSettingLeetCodeMate(initLeetCodeMateSettings);
	console.log("[loaded] leetcodemate settings");
    }, []);
    

    useEffect(async () => {
	if (settingsLeetCodeMate != null) {
	    setReady({...ready, loadedLeetCodeMateSettings : true});
	    console.log("[loaded flag on] leetcodemate settings");
	    console.log(settingsLeetCodeMate);
	}
    }, [settingsLeetCodeMate]);



    const handleLeetCodeMateSettingsChange = async (e) => {
	const newState = (() => {
	    const option = e.target.name;
	    if (option === 'autoCloseBrackets' || option === 'blinkingCursor') {
		const newEditConfig = {...settingsLeetCodeMate};
		newEditConfig.editor[option] = e.target.checked;
		return newEditConfig
	    }
	    if (option === 'toggleSubmissionPane' || option === 'toggleMateEditor' || option === 'submit' || option === 'test') {
		const newEditConfig = {...settingsLeetCodeMate};
		newEditConfig.keybinding[option] = e.target.value;
		return newEditConfig;
	    }
	    return state;
	})();
	setSettingLeetCodeMate(newState);
    };


    const [state, dispatch] = useReducer(reducer, initialState);


    const onInputChange = (e) => {
	dispatch({type: T.action.update_input, payload: e.target.value});
    };


    useEffect(async () => {
	if (settingsMateEditor != null) {
	    console.log('[loaded] mate editor settings');
	    setReady({...ready, loadedMateEditor: true});
	}
    }, [settingsMateEditor]);

    useEffect(async () => {
	const conf = await acquire.MateEditorSettings();	
	setSettingsEditor(conf);
    }, []);

    

    useEffect(async() => {
	setTimeout(async() => {
	    if (CN == false) {
		const p = await acquire.TaskInfo();
		setProblemSlug(p);
		const r = await acquire.QuestionDetailStats(p.question_title_slug);
		const inputCase = r.data.question.sampleTestCase;
		setDefaultCase(inputCase);
		setTaskInfo(r);
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




    const toggleSubmissionPane = () => {
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
    };



    const handleSubmit = () => {
	if (openMonaco) {
	    handleMonacoSubmit();
	    return;
	}
	if (open == false) {
	    setOpen(true);
	}
	if (judge) return;
	submitButtonRef.current.click();
    };


    const handleTest = () => {
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
    };
    
    
    useEffect(() => {
	if (ready.loadedLeetCodeMateSettings == false) {
	    return;
	}
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	const toggle = (e) => {
	    const keybinding = settingsLeetCodeMate.keybinding;
	    const bindKey = (keys, fn) => { if (triggers(e, keys)) fn(); }
	    bindKey(keybinding.toggleSubmissionPane, toggleSubmissionPane);
	    bindKey(keybinding.toggleMateEditor, ()=> { setOpenMonaco(!openMonaco) });
	    bindKey(keybinding.submit, handleSubmit);
	    bindKey(keybinding.test, handleTest);
	};
	window.addEventListener('keydown', toggle);
	return () => { window.removeEventListener('keydown', toggle); }
    });

    const mateEditorRef = () => {
	if (monacoRef.current == undefined || monacoRef.current == null) {
	    return undefined;
	}
	return monacoRef.current.editor;
    }

    
    const handleEditorSettingChange = async (e) => {
	const newState = (() => {
	    if (e.target.name == 'fontsize') {
		// side effect
		const editor = mateEditorRef();
		if (editor != undefined) {
		    editor.getWrapperElement().style['font-size'] = e.target.value;
		    editor.refresh();
		}
		return {...settingsMateEditor, [e.target.name]: e.target.value };	
	    }
	    if (e.target.name == 'cursorBlinkRate') {
		return {...settingsMateEditor, [e.target.name]: e.target.checked ? 530 : 0};
	    }
	    if (e.target.name == 'indentUnit' || e.target.name == 'keyMap' || e.target.name == 'theme' || e.target.name == 'mode') {
		return {...settingsMateEditor, [e.target.name]: e.target.value };
	    }
	    return {...settingsMateEditor, [e.target.name]: e.target.checked };
	})();
	chrome.storage.local.set({
	    mateEditorSettings: JSON.stringify(newState),
	}, function() {
	    console.log('[stored] new mate editor settings');
	});
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

	const handleButtonSubmit = async () => {
	    dispatch({ type: T.action.update_input, payload: "" });
	    setMode(T.mode.submit);
	    setJudge(true);
	    
	    const res = CN == true ? await submitCN(state, problemSlug) : await submit(state, problemSlug);
	    
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
	const handleMateEditor = () => {
	    /* acquire.MateEditorSettings(); */
	    setOpenMonaco(!openMonaco);
	}

        return (
            <>
		<ThemeProvider theme={theme}>
		    <Button 
   			variant = "contained"
			size = "small"
			onClick =  { handleMateEditor }
			color="primary">
			Editor
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
			      ref = { submitButtonRef } onClick = { handleButtonSubmit } disabled = { judge || failed } color="primary"> Submit </Button>
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

    
    const XX = (e, d) => {
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

    const onResizeStopMonaco = (e, dir, ref) => {
	setHeightMonaco(parseInt(ref.style.height))
	setWidthMonaco(parseInt(ref.style.width));
    };
    

    const onResizeMonac = (e, dir, ref) => {
	const width = parseInt(ref.style.width);
	const height = parseInt(ref.style.height);
	monacoRef.current.editor.setSize(width, height - 90);
    };


    const handleCodeChange = ((editor, data, value) => { });


    const saveMateEditor = () => {
	setCodeMateEditor(monacoRef.current.editor.getValue())
    }

    
    
    const checkReady = () => {
	return Object.entries(ready).map(x => x[1]).reduce((x, y) => (x && y));
    };


    if (checkReady() == false) {
	return null;
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
			  <LeetCodeMateSettings open = { openSetting } onClose = {() => {setOpenSetting(false)}}
			                        onChange = { handleLeetCodeMateSettingsChange }
			                        settings = { settingsLeetCodeMate }
			  />
		      </>

		      <>
			  <MonacoDialog open = {openMonaco}
			                task = { taskInfo }
      			                W = {widthMonaco} H = {heightMonaco}
					editorSettings = { settingsMateEditor }
			                onResizeMonoco = {onResizeMonac}
			                onResizeStopMonaco = { onResizeStopMonaco }
			                onCodeChange = { handleCodeChange }
			  		save = { saveMateEditor }

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
