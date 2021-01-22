import React from 'react';
import Button from '@material-ui/core/Button';
import {IconButton} from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import { isCN } from "../../../lib/acquire.js";
import { Resizable } from "re-resizable";


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
import ReactResizeDetector from 'react-resize-detector';
import { useResizeDetector } from 'react-resize-detector';
import HashLoader from "react-spinners/HashLoader";
import useResizeAware from 'react-resize-aware';

import BuildIcon from '@material-ui/icons/Build';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import SettingsIcon from '@material-ui/icons/Settings';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { TestCaseManager } from "./TestCaseManager.jsx";

import { withValidRef } from "./utility.js";
import { readSession } from "../../../lib/sessions.jsx";

const LAYOUT_EDITOR_FRONT = {
    submission: 1000,
    textinput: 1100,
    editor: 1200,
    editor_lang_select: 1300,
    editor_settings: 1400
};


const LAYOUT_MATE_FRONT = {
    submission: 1200,
    testinput:1500,
    editor: 1000,
    editor_lang_select: 1300,
    editor_settings: 1400
};

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
    console.log(props);
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
            <Paper style = {{zIndex: props.state.layout.zindex.submission, backgroundColor: "rgba(0,0,0,0.3)"}} {...paperProps} />
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


import {reducer as reducerGlobal, init as initGlobalState} from "./reducers/global.jsx";



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
    const [resizeListener, sizes] = useResizeAware();
    const [submitPortal, setSubmit] = React.useState('leetcode-editor');
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
    const [taskInfo, setTaskInfo] = React.useState(null);
    const [cursorPos, setCursorPos] = React.useState({line: 1, ch: 1, sticky: null});
    const [pos, setPos] = React.useState({x: 0, y:0})
    const [inputCursor, setInputCursor] = React.useState([0, 0]);
    const [monacoLan, setMonacoLan] = React.useState(null);
    
    const [W, setW] = React.useState(800);
    const [H, setH] = React.useState(500);

    const [ready, setReady] = React.useState({
	loadedMateEditor: false,
	loadedLeetCodeMateSettings: false,
	loadedTask: false
    });

    const textRef = useRef();
    const barRef = useRef();
    const inputBoxRef = useRef();
    const submitButtonRef = useRef();
    const runButtonRef = useRef();
    const runDefaultButtonRef = useRef();
    const monacoRef = useRef();
    const stdoutRef = React.useRef();
    const errmsgRef = React.useRef();
    const outputRef = React.useRef();
    const expectedRef = React.useRef();

    const [openCaseManager, setOpenCaseManager] = React.useState(false);
    const [cursorMate, setCursorMate] = React.useState({line: 1, ch: 1, sticky: null});
    const [stateGloal, dispatchGlobal] = React.useReducer(reducerGlobal, initGlobalState);


    const [mateInit, setMateInit] = React.useState(false);
    const [session, setSession] = React.useState(false);



    const [openMonaco, setOpenMonaco] = React.useState(false);
    const [widthMonaco, setWidthMonaco] = React.useState(600);
    const [heightMonaco, setHeightMonaco] = React.useState(800);
    const [codeMateEditor, setCodeMateEditor] = React.useState("");  
    const [settingsMateEditor, setSettingsEditor] = React.useState(null);
    const containerRef = React.useRef();
    
    const [focusMateEditor, setFocusMateEditor] = React.useState({
	on: false,
	component: undefined
    });

    


    const [state1, setState1] = React.useState({
	layout: {
	    zindex: {
		submission: 1,
		monaco: 1
	    },
	    focus: {
		submission: false,
		monaco: false
	    },
	    sizes: {
		editor: {
		    W: 600,
		    H: 800
		}
	    },
	    postion: {
		editor: {
		    x: 0, y: 0
		},
		submission: {
		    x: 0, y: 0
		}
	    }
	}
    });


    

    const onStop = (e, data) => {
	console.log("stop");
	setPos({x: data.lastX, y: data.lastY});
	return;
    };

    const onStart = (e, data) => {
	setState1({
	    ...state1,
	    layout: {
		zindex: {
		    ...state1.zindex,
		    submission:2000
		},
		focus: {
		    ...state1.focus,
		    submission:true
		}
	    }
	})
	
	if (e.target != undefined && e.target.viewportElement != undefined && e.target.viewportElement.id == "matepaneclose") {
	    handleClose();
	    return;
	}
	if (e.target != undefined && e.target.id == "matepaneclosebutton") {
	    handleClose();
	    return;
	}
	setPos({x: data.lastX, y: data.lastY});
	return;
    };


    const [cursors, setCursors] = React.useState({
	input: [0, 0],
	output: [0, 0],
	expected: [0, 0],
	stdout: [0, 0],
	errmsg: [0, 0]
    });
    
    
    const [settingsLeetCodeMate, setSettingLeetCodeMate] = React.useState(null);

    
    



    useEffect(async () => {
	const initLeetCodeMateSettings =  await acquire.LeetCodeEditorSettings();
	console.log(initLeetCodeMateSettings);
	setSettingLeetCodeMate(initLeetCodeMateSettings);
	let event = new CustomEvent('EDITOR_CONFIG_EVENT', {detail: {
	    action: "SET",
	    data: initLeetCodeMateSettings
	}});
	window.dispatchEvent(event);

	console.log("[loaded] leetcodemate settings");
    }, []);
    

    useEffect(async () => {
	if (settingsLeetCodeMate != null) {
	    setReady({...ready, loadedLeetCodeMateSettings : true});
	    let event = new CustomEvent('EDITOR_CONFIG_EVENT', {detail: {
		action: "SET",
		data: settingsLeetCodeMate
	    }});
	    window.dispatchEvent(event);
	    console.log("[loaded flag on] leetcodemate settings");
	}
    }, [settingsLeetCodeMate]);

    useEffect(async() => {
	if (taskInfo != null) {
	    setReady({...ready, loadedTask : true});
	    console.log("[loaded flag on] taskinfo settings");
	    const logSession = await readSession(questionID());
	    setSession(logSession);
	    console.log("[loaded session]");
	}
    }, [taskInfo]);




    useEffect(async () => {
	if (settingsMateEditor != null) {
	    console.log('[loaded] mate editor settings');
	    setReady({...ready, loadedMateEditor: true});
	    setMonacoLan(MATE_EDITOR_LANGUAGE[settingsMateEditor.mode].leetcode_slug);
	}
    }, [settingsMateEditor]);


    useEffect(async () => {
	if (monacoLan != null) {
	    if (taskInfo == null) {
		console.log("lang changed but no");
	    }
	    else {
		const session = await readSession(taskInfo.data.question.questionId);
		console.log(monacoLan);
		const code = session.code[monacoLan];
		if (code.length < 10) {
		    dispatchGlobal({type: 'RESET_MATE', ref: monacoRef, value: (() => {
			const matched_item = taskInfo.data.question.codeSnippets.find(x => {
			    return x.langSlug === monacoLan;
			});
			console.log(matched_item);
			return matched_item.code;
		    })()});
		}
		else {
		    dispatchGlobal({type: 'RESET_MATE', ref: monacoRef.current, value: code});
		}
		console.log("lang changed");
	    }
	}
    }, [monacoLan]);



    
    

    useEffect(async () => {
	const conf = await acquire.MateEditorSettings();	
	setSettingsEditor(conf);
	setMonacoLan(MATE_EDITOR_LANGUAGE[conf.mode].leetcode_slug);
    }, []);

    

    const updateTaskInfo = async () => {
	setTimeout(async() => {
	    if (CN == false) {
		console.log('[status] updating task info');
		const p = await acquire.TaskInfo();
		setProblemSlug(p);
		const r = await acquire.QuestionDetailStats(p.question_title_slug);
		if (taskInfo != null && r.data.question.title != taskInfo.data.question.title) {
		    const matched_item = r.data.question.codeSnippets.find(x => {
			return x.langSlug === MATE_EDITOR_LANGUAGE[settingsMateEditor.mode].leetcode_slug;
		    });
		    dispatchGlobal({type: 'INIT_MATE', value: matched_item.code});
		}
		if (taskInfo == null) {
		    const conf = await acquire.MateEditorSettings();	
		    const matched_item = r.data.question.codeSnippets.find(x => {
			return x.langSlug === MATE_EDITOR_LANGUAGE[conf.mode].leetcode_slug;
		    });
		    dispatchGlobal({type: 'INIT_MATE', value: matched_item.code});
		}
		const inputCase = r.data.question.sampleTestCase;
		setDefaultCase(inputCase);
		setTaskInfo(r);
	    }
	    else {
		const p = await acquire.TaskInfoCN();
		setProblemSlug(p);
		const r = await acquire.QuestionDetailStatsCN(p.question_title_slug);
		if (taskInfo != null && r.data.question.title != taskInfo.data.question.title) {
		    const matched_item = r.data.question.codeSnippets.find(x => {
			return x.langSlug === MATE_EDITOR_LANGUAGE[settingsMateEditor.mode].leetcode_slug;
		    });
		    dispatchGlobal({type: 'INIT_MATE', value: matched_item.code});
		}
		if (taskInfo == null) {
		    const conf = await acquire.MateEditorSettings();	
		    const matched_item = r.data.question.codeSnippets.find(x => {


			return x.langSlug === MATE_EDITOR_LANGUAGE[conf.mode].leetcode_slug;
		    });
		    dispatchGlobal({type: 'INIT_MATE', value: matched_item.code});
		}
		const inputCase = r.data.question.sampleTestCase;
		setDefaultCase(inputCase);
		setTaskInfo(r);
	    }
	}, 500);
    };

    
    const handleLeetCodeMateSettingsChange = async (e) => {
	const newState = (() => {
	    const option = e.target.name;
	    if (option === 'autoCloseBrackets' || option === 'blinkingCursor' || option === 'hide') {
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
	chrome.storage.local.set({
	    leetcodeEditorSettings : JSON.stringify(newState),
	}, function() {
	    console.log('[stored] new leetcode mate  settings');
	});
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    

    const onInputChange = (e) => {
	dispatch({type: T.action.update_input, payload: e.target.value});
    };

    useEffect(() => {
	const handleUrlChange = (request, sender, sendResponse) => {
	    if (request.message === 'HANDLE_URL_CHANGE') {
		const newUrl = request.url;
		if (newUrl.match("leetcode.com/problems") == null && newUrl.match("leetcode-cn.com/problems") == null) {
		    return;
		}
		else {
		    updateTaskInfo();
		    
		    if (!CN) {
			let event = new CustomEvent('EDITOR_CONFIG_EVENT', {detail: {
			    action: "SET",
			    data: settingsLeetCodeMate
			}});
			window.dispatchEvent(event);
		    }
		    console.log("[background msg] updated task info");
		    return;
		}
	    }
	}
	chrome.runtime.onMessage.addListener(handleUrlChange);
	return () => { chrome.runtime.onMessage.removeListener(handleUrlChange) };
    });


    

    useEffect(async() => { updateTaskInfo(); }, []);
    
    useEffect(async() => {
	if (failed) {
	    setTimeout(() => { setFail(false) }, 3000);
	}
    }, [failed]);





    const toggleSubmissionPane = () => {
	if (open) {
	    if (!judge && state.result_status != T.result.accepted) {
		dispatch({type: T.action.update_input, payload: textRef.current.value});
	    }
	    setOpen(false);
	}
	else {
	    /* bringMateFront(); */
	    setOpen(true);
	}
    };


    const handleGReset = () => {
	dispatch({ type: T.action.reinitialize });
	setMode(null);
	setJudge(false);
    };
    
    const handleSubmit = () => {
	if (judge) return;

	if (open == false) {
	    setOpen(true);
	}

	saveMateEditor();

	if (openMonaco) {
	    setSubmit('mate-editor')

	    handleMonacoSubmit();

	    return;
	}
	else {
	    setSubmit('leetcode-editor')
	    submitButtonRef.current.click();
	}
    };



    const withSave = (fn) => {
	return (...args) => {
	    if (monacoRef.current != undefined && monacoRef.current != null) {
		dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	    }
	    if (textRef.current != null && textRef.current != undefined) {
		dispatch({ type: T.action.update_input, payload: textRef.current.value });
		setCursors({
		    ...cursors,
		    input: [textRef.current.selectionEnd, textRef.current.selectionEnd]
		});
	    }
	    

	    if (barRef.current != null && barRef.current != undefined) {
		setBarPos(barRef.current.clientWidth);
	    }
	    fn(...args);
	};
    };


    const toggleMonaco = () => {
	/* bringEditorFront(); */
	setOpenMonaco(!openMonaco);
    };
    
    
    const handleTest = () => {
	if (open == false) {
	    setOpen(true);
	}
	if (judge) return;

	if (openMonaco) {
	    saveMateEditor();
	    handleMonacoTest();
	    return;
	}
	
	if (textRef.current == null || textRef.current.value.trim() == "") {
	    runDefaultButtonRef.current.click();
	}
	else {
	    runButtonRef.current.click();
	}
    };



    useEffect(() => {
	const test = (e) => {
	    if (e.target == undefined || e.target.className == undefined) {
		return;
	    }
	    else {
		if (String(e.target.className).toLowerCase().match("codemirror") != null && e.path.some(x => x.id == 'mate-editor') == false) {
		    if (submitPortal != 'leetcode-editor') {
			if (focusMateEditor) {
			    setFocusMateEditor(false);
			}
			setSubmit('leetcode-editor');
		    }
		}
	    }
        };
	
	window.addEventListener('click', test);
	return () => {window.removeEventListener('click', test)};
    });
    
    
    useEffect(() => {
	if (ready.loadedLeetCodeMateSettings == false) {
	    return;
	}
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	const toggle = (e) => {
	    const keybinding = settingsLeetCodeMate.keybinding;
	    const bindKey = (keys, fn) => { if (triggers(e, keys)) fn(); }
	    bindKey(keybinding.toggleSubmissionPane, withSave(toggleSubmissionPane));
	    bindKey(keybinding.toggleMateEditor, withSave(toggleMonaco));
	    bindKey(keybinding.submit, withSave(handleSubmit));
	    bindKey(keybinding.test, withSave(handleTest));
	    if (e.key == "Escape") {
		withSave(() => {
		    handleClose();
		})();
	    }
	    if (e.altKey && e.key == "l") {
		setOpenCaseManager(!openCaseManager);
	    }
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




    const questionID = () => {
	return taskInfo.data.question.questionId;
    }


    const updateSession = async () => {
	if (taskInfo == null) {
	    return;
	}
	else {
	    setSession(await readSession(questionID()));
	}
    }

    const updateTestCase = async (result) => {
	const result_status = result.result_status;
	if (result_status == "Wrong Answer" || result_status == "Time Limit Exceeded" ||
	    result_status == "Runtime Error" || result_status == "Memory Limit Exceeded" ) {
	    const status = await new Promise((resolve, fail) => {
		chrome.runtime.sendMessage({action: "SESSION_UPDATE_TESTCASE", payload: {
		    pid: questionID(),
		    input: result.input,
		    expected: result.expected
		}}, async function(response) {
		    resolve(response.status);
		})
	    });

	    setSession(await readSession(questionID()));
	}
    };
    
    
    const handleMonacoSubmit = async () => {
	saveMateEditor();
	dispatch({ type: T.action.update_input, payload: "" });
	setMode(T.mode.submit);
	setJudge(true);

	const res = await (() => {
	    if (CN) {
		return submitCN(state, problemSlug, monacoRef.current.editor.getValue(), monacoLan);
	    }
	    else {
		return submit(state, problemSlug, monacoRef.current.editor.getValue(), monacoLan);
	    }
	})();

	updateTestCase(res);
	

	saveMateEditor();
	if (res == null) {
	    handleGReset();
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
		handleButtonReset();
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
	    updateTestCase(res);

	    if (res == null) {
		handleButtonReset();
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
		handleButtonReset();
		setFail(true);
		return;
	    }
	    setOpen(true);
	    res.input = defaultCase;
	    dispatch({ type: T.action.update, payload: res });
	    setJudge(false);
	    updateMessagePaneTabStatus(res);
	};
	

	const handleMini = () => {
	    if (mini == false) {
		setW(565);
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
		return (
		    <FullscreenIcon/>
		);
	    }
	    else {
		return (
		    <FullscreenExitIcon/>
		);
	    }
	}

	const handleButtonReset = () => {
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

	const ModeIcon = () => {
	    if (mode == T.mode.test) {
		return <BuildIcon style = {{color:"white"}}/>;
	    }
	    else {
		return null;
	    }
	}

	const JudgeLoader = () => {
	    if (judge) {
		return (
		    <Box ml = {3} mt = {2}>
		    	<HashLoader size = {25} color = "yellow" loading = {judge} />
		    </Box>
		);
	    }
	    return null;
	}

	const handleButtonClose = () => {
	    setOpen(false);
	}

	const handlePlay = async () => {
	    const x = await readSession(questionID());
	}
	    
	
	const EditorMode = () => {
	    return (
		// hack
		<Box mt = {mode == T.mode.test ? 0.25 : 0}>
		    <Typography variant = 'subtitle1' style= {{color: "white", align: 'left'}}>
			{(() => {
			    if (submitPortal == "leetcode-editor") {
				return mini ? "L" : submitPortal;
			    }
			    if (submitPortal == "mate-editor") {
				return mini ? "M" : submitPortal;
			    }
			})()}
		    </Typography>
		</Box>
	    );
	};

        return (
            <>
		<ThemeProvider theme={theme}>
		    <Box display= "flex" flexDirection="row" ml = {2}>
			<EditorMode />
			<Box ml = {1.5} display = "flex" flexDirection = "row" >
			    <Box ml = {0}>
				<Button 
   				    variant = "contained"
				    size = "small"
				    onClick =  { handleMateEditor }
				    color="primary">
				    <DeveloperModeIcon fontSize = 'default'/>
				</Button>
			    </Box>
			    <Box ml = {1}>
				<Button 
   				    variant = "contained"
				    size = "small"
				    onClick =  { handleSetting }
				    color="primary">
				    <SettingsIcon fontSize = 'default'/>
				</Button>
			    </Box>
			    <Box ml = {1}>
				<Button 
   				    variant = "contained"
				    size = "small"
				    onClick =  { handleMini }
				    color="primary">
				    {renderMini()}
				</Button>
			    </Box>
			</Box>
			<JudgeLoader />
			<Box ml = {2} mt = {0.4}>
			    <ModeIcon />
			</Box>
		    </Box>
		    <div style={{flex: '1 0 0'}} />

		    
		    <Button ref = { runDefaultButtonRef }
   			variant = "contained"
			size = "small"
			onClick =  { handleRunDefault }
			disabled = { judge || failed } color="primary">
			{ mini ? "Default" : "Run Default" }
		    </Button>
		    <Button   variant = "contained"
			      size = "small"
			      ref = { runButtonRef } onClick = { handleRunCustom } disabled = { judge || failed } color="primary"> Run </Button>
		    <Button   variant = "contained"
			      size = "small"
			      ref = { submitButtonRef } onClick = { handleButtonSubmit } disabled = { judge || failed } color="primary"> Submit </Button>
		    <Button   variant = "contained"
			      size = "small"
			      onClick = { handleButtonReset } disabled = { false } color="primary"> Reset </Button>
		</ThemeProvider>
            </>
        );
    };


    
    const XX = (e, d, ref) => {
	setH(parseInt(ref.style.height))
	setW(parseInt(ref.style.width));
    };


    const MiddleContent = (_props) => {
	if ((mode == T.mode.submit && judge == true) || (state.result_status == T.result.accepted && mode == T.mode.submit)) {
	    return (
		<ContentViewSubmitOrAccepted loading = { judge }
		                             sizes= {sizes}
		                             onClose = { _props.onClose }
		                             submit = {submitPortal}
					     state = { state }
					     mode = { mode }
		/>
	    );
	}
	else {
	    return (
		<ContentViewDefault loading = { judge } state = { state } mode = { mode }
		                    barPos = { barPos } barRef = {barRef}
				    submit = {submitPortal}
				    onClose = { _props.onClose }
		                    sizes = { sizes }
		                    containerRef = {containerRef}
		                    refs = {{stdout: stdoutRef, err: errmsgRef, output: outputRef, expected: expectedRef }}
		                    stdoutRef = {stdoutRef}
		                    inputCursor = {inputCursor }
		                    inputRef = { textRef } failed = { failed }
		                    tabID = { value } handleTabChange = { handleChange }
	        />
	    );
	}
    }




    const saveMateEditor = () => {
	if (monacoRef.current != undefined) {
	    setCodeMateEditor(monacoRef.current.editor.getValue());
	}
    }
    
 


    
    
    const checkReady = () => {
	return Object.entries(ready).map(x => x[1]).reduce((x, y) => (x && y));
    };

    const handleMonacoTest = async () => {
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

	const res = await (async () => {
	    if (CN == true) {
		return runtestCN(inputTextCase, problemSlug);
	    }
	    else {
		return runtest(inputTextCase, problemSlug, monacoRef.current.editor.getValue(), monacoLan);
	    }
	})();	

	if (res == null) {
	    handleButtonReset();
	    setFail(true);
	    return;
	}
	res.input = inputTextCase;
	setOpen(true);
	dispatch({ type: T.action.update, payload: res });
	setJudge(false);
	updateMessagePaneTabStatus(res);
    };
    

    const saveInput = () => {
	if (textRef.current == null || textRef.current == undefined) {
	    return;
	}
	dispatch({ type: T.action.update_input, payload: textRef.current.value });
    };

    const handleClickSubmission = (e) => {
	console.log('called');
	saveInput();
	saveMateEditor();
    };
    
    if (checkReady() == false || taskInfo == null || settingsLeetCodeMate == null) {
	return null;
    }


    const getH = () => {
	if (mode == T.mode.test) {
	    return H;
	}
	if (judge || state.result_status == T.result.accepted) {
	    return 250;
	}
	else {
	    return H;
	}

    };

    const getMinH = () => {
	if (judge || state.result_status == T.result.accepted) {
	    return 250;
	}
	else {
	    return 400;
	}
    };

    const getW = () => {
	if (mode == T.mode.test) {
	    return W;
	}
	if (judge || state.result_status == T.result.accepted) {
	    return 800;
	}
	else {
	    return W;
	}

    };

    const getMinW = () => {
	if (judge || state.result_status == T.result.accepted) {
	    return 800;
	}
	else {
	    return 565;
	}
    };

    
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
			      style={{zIndex: state1.layout.zindex.submission, pointerEvents: 'none'}}  
			      disableBackdropClick = {true}
			      onClose= {withSave(handleClose)}
			      maxWidth={false}
			      PaperComponent={PaperComponent}
			      PaperProps={{ onStop: withSave(onStop), onStart: withSave(onStart), state: state1, position: pos,  style: {backgroundColor: 'rgba(0,0,0,0.6)', pointerEvents: 'auto'}}}
			      aria-labelledby="draggable-dialog-title"
			  >
			      <div  style={{ overflow: "hidden"}}>
				  {resizeListener}
				  <Resizable
				      size = {{width:getW(), height: getH() }}
				      minHeight = {getMinH()}
				      minWidth = {getMinW()}
				      onResizeStop ={ XX }
				  >
				      <MiddleContent onClose = {handleClose}/>

				      <DialogActions>
					  <Actions />
				      </DialogActions>
				  </Resizable>
			      </div>
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
			                onClick = {(e) => {					  
					    dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
					    dispatch({ type: T.action.update_input, payload: textRef.current.value });
					    setState1({
						...state1,
						layout: {
						    zindex: {
							submission: 1,
							monaco: 2000
						    },
						    focus: {
							submission: false,
							monaco: true
						    }
						}
					    })

					    if (submitPortal != 'mate-editor') {
						setSubmit('mate-editor');
					    }
					    
					}}
			  
			                cursor =  {cursorMate}
			                stateGlobal = {stateGloal}
			                dispatch = { {
					    global: dispatchGlobal
					}
					}
			                state1={state1}
			                setCursor = {setCursorMate}
                                        focus = { focusMateEditor  }
			                id = { ID() }
      			                W = { widthMonaco } H = { heightMonaco }
			                editorSettings = { settingsMateEditor }
			  		save = { saveMateEditor }
			                saveInput = { saveInput }
			                handleTest = { handleMonacoTest }
			                handleSubmit = { handleMonacoSubmit }
			                code = { codeMateEditor }
			  handleChange = { handleEditorSettingChange } 
			  inputRef = { monacoRef }
			  handleClose = {withSave(() => {
			      setSubmit('leetcode-editor');
			      saveMateEditor();
			      setOpenMonaco(false);
			  })}
			                theme = { theme }
			  />
		      </>
		      <>
			  <TestCaseManager open = {openCaseManager} onClose = {() => { setOpenCaseManager(false)}}
					   id = "case-manager" theme = {theme} task = {taskInfo} session = {session} onChange = {setSession}
			                   mainUpdate = {{
					       session: async () => await updateSession()
					   }}
                                           mainFn = {{
					       questionID: () => questionID()
					   }}
			  
			  />
		      </>
		  </>
	      )}
	</div>
    );
}

export { LeetCodeMate };
