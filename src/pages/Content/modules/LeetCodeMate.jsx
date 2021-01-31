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
const SIDE_PANEL_WIDTH = "400px";

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
    const paperProps = Object.fromEntries(Object.entries(props)
						.filter(([k, v]) => k !=  'onStop' && k != 'position' && k != 'onStart'));
    return (
        <Draggable
	    position = {props.state.layout.position.submission}
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



function toggleSidePanel() {
    console.log('here');
    if (document.getElementsByClassName("side-tools-wrapper__1TS9") == undefined) {
	return;
    }
    let curFlexValue = document.getElementsByClassName("side-tools-wrapper__1TS9")[0].style.flex.split(' ');
    if (curFlexValue[2] == "0px") {
	curFlexValue[2] = SIDE_PANEL_WIDTH;
    }
    else {
	curFlexValue[2] = "0px";
    }
    document.getElementsByClassName("side-tools-wrapper__1TS9")[0].style.flex = curFlexValue.join(' ');
    return;
}


function toggleProblemPanel() {
    if (document.getElementsByClassName("question-picker-mask__396x hide__3nyv")[0] == undefined) {
	document.getElementsByClassName("question-picker-mask__396x show__3zYv")[0].click();
    }
    else {
	document.getElementsByClassName("picker-menu-handler__34CD css-6iyx43")[0].click();
    }
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
    console.log('rerender');
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
    const [resizeListener, sizes] = useResizeAware();
    const [submitPortal, setSubmit] = React.useState('leetcode-editor');
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
		},
		submission: {
		}
	    },
	    position: {
		submission: {
		    x: 0, y: 0
		},
		bar: undefined
	    }
	},
	inputbox: {
	    value: ""
	},
	open: {
	    submission: false,
	    editor: false
	}
    });


    

    const onStop = (e, data) => {
	/* if (textRef.current == undefined) return; */
	if (e.target != undefined && (e.target.tagName == "path" || e.target.tagName == "svg")) {
	    return;
	}
	const curX = state1.layout.position.submission.x;
	const curY = state1.layout.position.submission.y;
	setState1({
	    ...state1,
	    layout: {
		zindex: {
		    ...state1.layout.zindex,
		    submission:2000
		},
		focus: {
		    ...state1.layout.focus,
		    submission:true
		},
		position: {
		    ...state1.layout.position,
		    submission: {x: data.lastX, y:data.lastY},
		}
	    },
	    inputbox: {
		value: textRef.current == undefined ? state1.inputbox.value : textRef.current.value
	    }
	    
	})
	return;
    };

    const onStart = (e, data) => {
	if (monacoRef.current != undefined && stateGloal.editor.value != monacoRef.current.editor.getValue()) {
	    dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	}
	if (barRef.current != undefined && barRef.current.clientWidth != barPos) {
	    setBarPos(barRef.current.clientWidth);
	}

	const curX = state1.layout.position.submission.x;
	const curY = state1.layout.position.submission.y;

	if (e.target != undefined && (e.target.tagName == "path" || e.target.tagName == "svg")) {
	    handleClose();
	    return;
	}

	if (textRef.current == undefined) return;

	if (state1.inputbox.value == textRef.current.value && curX == data.lastX && curY ==  data.lastY) {
	    return;
	}
	else {
	    setState1({
		...state1,
		layout: {
		    ...state1.layout,
		    zindex: {
			...state1.layout.zindex,
			submission:2000
		    },
		    focus: {
			...state1.layout.focus,
			submission:true
		    },
		    position: {
			...state1.layout.position,
			submission: {x: data.lastX, y:data.lastY},
		    }
		},
		inputbox: {
		    value: textRef.current.value
		}
		
	    })
	    return;
	}
    };
    
    const [settingsLeetCodeMate, setSettingLeetCodeMate] = React.useState(null);


    useEffect(async () => {
	const initLeetCodeMateSettings =  await acquire.LeetCodeEditorSettings();
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
	    }
	    else {
		const session = await readSession(taskInfo.data.question.questionId);
		const code = session.code[monacoLan];
		if (code.length < 10) {
		    dispatchGlobal({type: 'RESET_MATE', ref: monacoRef, value: (() => {
			const matched_item = taskInfo.data.question.codeSnippets.find(x => {
			    return x.langSlug === monacoLan;
			});
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
		/* setProblemSlug(p); */
		const r = await acquire.QuestionDetailStats(p.question_title_slug);
		console.log(r);
		if (p.id == undefined) {
		    p.question_id = r.data.question.questionId;
		}
		console.log(p);
		setProblemSlug(p);
		
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
		setState1({
		    ...state1,
		    inputbox: {
			value: inputCase
		    }
		});
	    }
	    else {
		const p = await acquire.TaskInfoCN();
		/* setProblemSlug(p); */
		const r = await acquire.QuestionDetailStatsCN(p.question_title_slug);
		if (p.id == undefined) {
		    p.question_id = r.data.question.questionId;
		}
		setProblemSlug(p);
		console.log(p);
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
		setState1({
		    ...state1,
		    inputbox: {
			value: inputCase
		    }
		});
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


    useEffect(() => {
	const enforceEditorSetting = (e) => {
	    if (!CN) {
		let event = new CustomEvent('EDITOR_CONFIG_EVENT', {detail: {
		    action: "ENFORCE",
		    data: settingsLeetCodeMate
		}});
		window.dispatchEvent(event);
	    }
	};
	window.addEventListener('click', enforceEditorSetting)
	return () => window.removeEventListener('click', enforceEditorSetting);
    });


    

    useEffect(async() => { updateTaskInfo(); }, []);
    
    useEffect(async() => {
	if (failed) {
	    setTimeout(() => { setFail(false) }, 3000);
	}
    }, [failed]);



    const saveinput = () => {
	if (textRef.current != undefined) {
	    if (state1.inputbox.value != textRef.current.value) {
		setState1({
		    ...state1,
		    inputbox: {
			value: textRef.current.value
		    }
		})
	    }
	    else {
		return;
	    }
	}
    }

    const setinput = (val) => {
	setState1({
	    ...state1,
	    inputbox: {
		value: val
	    }
	})
    }

    const clearinput = () => {
	setState1({
	    ...state1,
	    inputbox: {
		value: ""
	    }
	})
    }
    
    const toggleSubmissionPane = () => {
	const open = state1.open.submission;
	if (open) {
	    if (monacoRef.current != undefined && monacoRef.current != null) {
		if (stateGloal.editor.value != monacoRef.current.editor.getValue()) {
		    dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
		}
	    }
	    if (barRef.current != null && barRef.current != undefined) {
		if (barPos != barRef.current.clientWidth) {
		    setBarPos(barRef.current.clientWidth);
		}
	    }
	    if (!judge && state.result_status != T.result.accepted) {
		saveinput();
	    }
	    const layout = state1.layout;

	    setState1({
		...state1,
		layout: {
		    ...state.layout,
		    zindex: {
			...layout.zindex,
			submission: 1
		    },
		    focus: {
			...layout.focus,
			submission: false
		    },
		    position: state1.layout.position
		},
		open: {
		    ...state1.open,
		    submission: false
		}
	    });
	    return;
	}
	else {
	    setState1({
		...state1,
		layout: {
		    ...state1.layout,
		    zindex: {
			submission: 2000,
			monaco: 1
		    },
		    focus: {
			editor: false, // need it to untrap editor focus
			submission: false
		    },
		    position: state1.layout.position
		},
		open: {
		    ...state1.open,
		    submission: true
		}
	    });
	    return;
	}
    };


    const handleGReset = () => {
	dispatch({ type: T.action.reinitialize });
	setMode(null);
	setJudge(false);
    };
    
    const handleSubmit = () => {
	if (monacoRef.current != undefined && monacoRef.current != null) {
	    if (stateGloal.editor.value != monacoRef.current.editor.getValue()) {
		dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	    }
	}
	if (barRef.current != null && barRef.current != undefined) {
	    if (barPos != barRef.current.clientWidth) {
		setBarPos(barRef.current.clientWidth);
	    }
	}
	if (judge) return;
	if (state1.open.submission == false) {
	    setState1({
		...state1,
		open: {
		    ...state1.open,
		    submission: true
		}
	    });
	}
	saveMateEditor();
	const openMonaco = state1.open.editor;
	if (openMonaco) {
	    /* setSubmit('mate-editor') */
	    handleMonacoSubmit();
	    return;
	}
	else {
	    /* setSubmit('leetcode-editor') */
	    submitButtonRef.current.click();
	}
    };


    



    const toggleMonaco = (forceClose = false) => {
	const open = state1.open.editor;
	const layout = state1.layout;
	if (open || forceClose) {
	    if (monacoRef.current != undefined && monacoRef.current != null) {
		if (stateGloal.editor.value != monacoRef.current.editor.getValue()) {
		    dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
		}
	    }
	    if (barRef.current != null && barRef.current != undefined) {
		if (barPos != barRef.current.clientWidth) {
		    setBarPos(barRef.current.clientWidth);
		}
	    }
	    if (!judge && state.result_status != T.result.accepted) {
		saveinput();
	    }
	    setState1({
		...state1,
		layout: {
		    ...state1.layout,
		    zindex: {
			...layout.zindex,
			monaco: 1
		    },
		    focus: {
			monaco: true,
			submission: false
		    },
		    position: state1.layout.position

		},
		open: {
		    ...state1.open,
		    editor: false
		}
	    });
	    return;
	}
	else {
	    setState1({
		...state1,
		layout: {
		    ...state1.layout,
		    zindex: {
			submission: 1,
			monaco: 2000
		    },
		    focus: {
			monaco: true,
			submission: false
		    },
		    position: state1.layout.position
		},
		open: {
		    ...state1.open,
		    editor: true
		}
	    });
	}
    };
    
    
    const handleTest = () => {
	if (monacoRef.current != undefined && monacoRef.current != null) {
	    if (stateGloal.editor.value != monacoRef.current.editor.getValue()) {
		dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	    }
	}
	if (barRef.current != null && barRef.current != undefined) {
	    if (barPos != barRef.current.clientWidth) {
		setBarPos(barRef.current.clientWidth);
	    }
	}
	if (state1.open.submission == false) {
	    setState1({
		...state1,
		open: {
		    ...state1.open,
		    submission: true
		}
	    });
	}

	if (judge) return;
	const openMonaco = state1.open.editor;
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

    const testAll = () => {
	if (monacoRef.current != undefined && monacoRef.current != null) {
	    if (stateGloal.editor.value != monacoRef.current.editor.getValue()) {
		dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	    }
	}
	if (barRef.current != null && barRef.current != undefined) {
	    if (barPos != barRef.current.clientWidth) {
		setBarPos(barRef.current.clientWidth);
	    }
	}
	if (state1.open.submission == false) {
	    setState1({
		...state1,
		layout: {
		    ...state1.layout,
		    focus: {
			...state1.layout.focus,
			submission: true,
		    },
		    zindex: {
			submission:2005,
			monaco: 1
		    }
		},
		open: {
		    ...state1.open,
		    submission: true
		}
	    });
	}
	forceUpdate();
	if (state1.layout.focus.editor) {
	    handleMonacoTestAll();
	}
	else {
	    handleRunAll();
	}

    }

    
    
    useEffect(() => {
	if (ready.loadedLeetCodeMateSettings == false) {
	    return;
	}
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	const toggle = (e) => {
	    const keybinding = settingsLeetCodeMate.keybinding;
	    const bindKey = (keys, fn) => { if (triggers(e, keys)) fn(); }
	    bindKey(keybinding.toggleSubmissionPane, toggleSubmissionPane);
	    bindKey(keybinding.toggleMateEditor, toggleMonaco);
	    bindKey(keybinding.submit, handleSubmit);
	    bindKey(keybinding.test, handleTest);
	    if (e.key == "Escape") {
		handleClose();
	    }
	    if (e.altKey && e.key == "l") {
		setOpenCaseManager(!openCaseManager);
	    }
	    if (e.altKey && e.key == "'") {
		testAll();
	    }
	    if (e.altKey && e.key == "\\") {
		toggleSidePanel();
	    }
	    if (e.ctrlKey && e.key == "\\") {
		toggleProblemPanel();
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


    
    const handleClose = () => {
	if (monacoRef.current != undefined && monacoRef.current != null) {
	    if (stateGloal.editor.value != monacoRef.current.editor.getValue()) {
		dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	    }
	}
	if (barRef.current != null && barRef.current != undefined) {
	    if (barPos != barRef.current.clientWidth) {
		setBarPos(barRef.current.clientWidth);
	    }
	}
	setState1({
	    ...state1,
	    open: {
		...state1.open,
		submission: false
	    }
	});
    }

    const handleChange = (event, newValue) => {
	if (monacoRef.current != undefined && monacoRef.current != null) {
	    if (stateGloal.editor.value != monacoRef.current.editor.getValue()) {
		dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	    }
	}
	if (barRef.current != null && barRef.current != undefined) {
	    if (barPos != barRef.current.clientWidth) {
		setBarPos(barRef.current.clientWidth);
	    }
	}
	saveinput();
        setValue(newValue);

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
	clearinput();
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


    const handleRunAll = async () => {
	if (state.result_status == T.result.accepted) {
	    setMode(T.mode.test);
	    dispatch({ type: T.action.reinitialize });
	    return;
	}
	if (textRef.current == null || textRef.current == undefined) {
	    return;
	}
	saveinput();
	setMode(T.mode.test); 
	setJudge(true);
	/* const inputTextCase = textRef.current.value.trim(); */
	let inputTextCase = await (async() => {
	    const lastestSession = await readSession(questionID());
	    const allcases = lastestSession.failed_case.map(x => x.trim()).map(x => x.split(">SPLIT1@2@3SPLIT<")[0]).join('\n');
	    console.log(allcases);
	    return allcases;
	})();
	console.log(inputTextCase);
	let res = CN == true ? await runtestCN(inputTextCase, problemSlug) : await runtest(inputTextCase, problemSlug);
	if (res == null) {
	    handleGReset();
	    setFail(true);
	    return;
	}
	/* res.input = inputTextCase; */

	setState1({
	    ...state1,
	    open: {
		...state1.open,
		submission: true
	    },
	    inputbox: {
		...state1.inputbox,
		value: inputTextCase
	    }
	    
	});

	dispatch({ type: T.action.update, payload: res });
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

	    saveinput();
	    setMode(T.mode.test); 
	    setJudge(true);
	    let inputTextCase = textRef.current.value.trim();
	    let res = CN == true ? await runtestCN(inputTextCase, problemSlug) : await runtest(inputTextCase, problemSlug);
	    if (res == null) {
		handleButtonReset();
		setFail(true);
		return;
	    }
	    res.input = inputTextCase;
	    if (state1.open.submission == false) {
		setState1({
		    ...state1,
		    open: {
			...state1.open,
			submission: true
		    }
		});
	    }
	    dispatch({ type: T.action.update, payload: res });
	    setJudge(false);
	    updateMessagePaneTabStatus(res);
	};

	const handleButtonSubmit = async () => {
	    clearinput();
	    setMode(T.mode.submit);
	    setJudge(true);

	    const res = CN == true ? await submitCN(state, problemSlug) : await submit(state, problemSlug);
	    console.log('got result: ');
	    console.log(res);
	    setinput(res.input? res.input : "");
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
		setDefaultCase(await acquire.DefaultTestCase());
	    }
	    textRef.current.value = defaultCase;
	    saveinput();
	    setMode(T.mode.test); 
	    setJudge(true);
	    let res = CN == true ? await runtestCN(textRef.current.value.trim(), problemSlug) : await runtest(textRef.current.value.trim(), problemSlug);
	    if (res == null) {
		handleButtonReset();
		setFail(true);
		return;
	    }
	    if (state1.open.submission == false) {
		setState1({
		    ...state1,
		    open: {
			...state1.open,
			submission: true
		    }
		});
	    }
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
	    setState1({
		...state1,
		layout: {
		    ...state1.layout,
		    zindex: {
			monaco: 1,
			submission: 1
		    }
		},
		open: {
		    ...state1.open
		},
		inputbox: {
		    ...state1.inputbox
		}
	    });
	    setOpenSetting(!openSetting);
	}

	const handleMateEditor = () => {
	    toggleMonaco();
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
	    setState1({
		...state1,
		open: {
		    ...state1.open,
		    submission: false
		}
	    });
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
			    const focus = state1.open.editor;
			    if (!focus) {
				return mini ? "L" : 'leetcode-editor';
			    }
			    else {
				return mini ? "M" : 'mate-editor';
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
			{ mini ? "Default" : "Default" }
		    </Button>
		    <Button   variant = "contained"
			      size = "small"
			      ref = { runButtonRef } onClick = { handleRunAll } disabled = { judge || failed } color="primary"> RunAll </Button>
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
		                    state1 = { state1 }
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


    const handleMonacoTestAll = async () => {
	setState1({
	    ...state1,
	    layout: {
		...state1.layout,
		zindex: {
		    submission: 2000,
		    monaco:1
		},
		focus: {
		    submission: true,
		    monaco: false
		}
	    },
	    open:{
		...state1.open,
		submission: true
	    }
	});
	if (state.result_status == T.result.accepted) {
	    setMode(T.mode.test);
	    dispatch({ type: T.action.reinitialize });
	    return;
	}
	forceUpdate();
	saveinput();
	setMode(T.mode.test); 
	setJudge(true);
	let inputTextCase = await (async() => {
	    const lastestSession = await readSession(questionID());
	    const allcases = lastestSession.failed_case.map(x => x.trim()).map(x => x.split(">SPLIT1@2@3SPLIT<")[0]).join('\n');
	    console.log(allcases);
	    return allcases;
	})();

	const res = await (async () => {
	    if (CN == true) {
		return runtestCN(inputTextCase, problemSlug, monacoRef.current.editor.getValue(), monacoLan);
	    }
	    else {
		return runtest(inputTextCase, problemSlug, monacoRef.current.editor.getValue(), monacoLan);
	    }
	})();	

	if (res == null) {
	    handleGReset();
	    setFail(true);
	    return;
	}
	setState1({
	    ...state1,
	    layout: {
		...state1.layout,
		zindex: {
		    submission: 2000,
		    monaco:1
		},
		focus: {
		    submission: true,
		    monaco: false
		}
	    },
	    open: {
		...state1.open,
		submission: true
	    },
	    inputbox: {
		value: inputTextCase
	    }	    
	});
	dispatch({ type: T.action.update, payload: res });
	setJudge(false);
	updateMessagePaneTabStatus(res);
    };

    const handleMonacoTest = async () => {

	if (state.result_status == T.result.accepted) {
	    setMode(T.mode.test);
	    dispatch({ type: T.action.reinitialize });
	    return;
	}

	saveinput();
	setMode(T.mode.test); 
	setJudge(true);
	let inputTextCase = textRef.current.value.trim();
	if (inputTextCase.length == 0) inputTextCase = defaultCase;

	const res = await (async () => {
	    if (CN == true) {
		return runtestCN(inputTextCase, problemSlug, monacoRef.current.editor.getValue(), monacoLan);
	    }
	    else {
		return runtest(inputTextCase, problemSlug, monacoRef.current.editor.getValue(), monacoLan);
	    }
	})();	

	if (res == null) {
	    handleGReset();
	    setFail(true);
	    return;
	}
	res.input = inputTextCase;
	setState1({
	    ...state1,
	    layout: {
		...state1.layout,
		zindex: {
		    submission: 2500,
		    monaco: 1
		}
	    },
	    open: {
		...state1.open,
		submission: true
	    },
	    inputbox: {
		value: inputTextCase,
	    }
	});
	dispatch({ type: T.action.update, payload: res });
	setJudge(false);
	updateMessagePaneTabStatus(res);
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

    const handleMonacoClick= (e, check = true) => {
	
	if (check) {
	    if (e == undefined) return;
	    
	
	    if (e.target != undefined && (e.target.tagName == 'svg' || e.target.tagName == "circle")) {
		toggleMonaco(true);
		return;
	    }
	    if (e.target != undefined && e.target.id === "drag-title") {
		return;
	    }
	}
	dispatchGlobal({type: 'SAVE_MATE', ref: monacoRef});
	setState1({
	    ...state1,
	    layout: {
		...state1.layout,
		zindex: {
		    submission: 1,
		    monaco: 2000
		},
		focus: {
		    submission: false,
		    monaco: true
		}
	    },
	    inputbox: {
		...state1.inputbox,
		value: textRef.current == undefined ? state1.inputbox.value : textRef.current.value
	    }
	})

	if (submitPortal != 'mate-editor') {
	    setSubmit('mate-editor');
	}
	
    };

    const handleMonacoClose = () => {
	toggleMonaco(true);
    }
    
    return (
        <div>
	    { (
		  <>
		      <>
			  <Dialog
			      id={"submission_pane"}
			      open={state1.open.submission}
			      hideBackdrop = {true}
			      disableAutoFocus = {true}
			      disableEnforceFocus
			      style={{zIndex: state1.layout.zindex.submission, pointerEvents: 'none'}}  
			      disableBackdropClick = {true}
			      onClose= {handleClose}
			      maxWidth={false}
			      PaperComponent={PaperComponent}
			      PaperProps={{ onStop:onStop, onStart: onStart, state: state1,  style: {backgroundColor: 'rgba(0,0,0,0.6)', pointerEvents: 'auto'}}}
			      aria-labelledby="draggable-dialog-title"
			  >
			      <div style={{ overflow: "hidden"}}>
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
			  <MonacoDialog open = {state1.open.editor}
			                task = { taskInfo }
			                onClick = {handleMonacoClick}
			                handleTestAll = {handleMonacoTestAll}
			                cursor =  {cursorMate}
			                stateGlobal = {stateGloal}
			                dispatch = { {
					    global: dispatchGlobal
					}}
			                state1={state1}
			                setCursor = {setCursorMate}
                                        focus = { focusMateEditor  }
			                id = { ID() }
      			                W = { widthMonaco } H = { heightMonaco }
			                editorSettings = { settingsMateEditor }
			  		save = { saveMateEditor }
			                saveInput = { saveinput }
			                handleTest = { handleMonacoTest }
			                handleSubmit = { handleMonacoSubmit }
			                code = { codeMateEditor }
			  handleChange = { handleEditorSettingChange } 
			  inputRef = { monacoRef }
			                handleClose = {() => 1}
			  handleClose = {handleMonacoClose}
		
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
