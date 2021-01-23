import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import React from 'react'
import Draggable from 'react-draggable'
import AceEditor from "react-ace";
import { Typography, createMuiTheme, Box, IconButton } from "@material-ui/core";
import { Resizable } from "re-resizable";
import { DraggableCore } from 'react-draggable';
import { ThemeProvider } from "@material-ui/styles";
import MonacoControlPanel from "./MonacoEditorControlPanel.jsx";
import { UnControlled as CodeMirror } from 'react-codemirror2'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CancelIcon from '@material-ui/icons/Cancel';
import MateEditorConfig from "./MateEditorConfig.jsx";
import { MateDialog } from "./MateWindow.jsx";
import { ID } from "./utility.js"
import { useMountedState, useMeasure} from 'react-use';
import { MateDialogRND } from './MateDialogRnd.jsx';

import { withValidRef } from "./utility.js";

import {readSession} from "../../../lib/sessions.jsx";




const MATE_EDITOR_LANGUAGE = {
    "text/x-c++src": {
	leetcode_slug: 'cpp',
	official_name: 'C++'
    },
    "text/x-csrc": {
	leetcode_slug: 'c',
	official_name: 'C'
    },
    "text/x-java": {
	leetcode_slug: 'java',
	official_name: 'Java'
    },
    "text/x-csharp": {
	leetcode_slug: 'csharp',
	official_name: 'C#'
    },
    "text/x-scala": {
	leetcode_slug: 'scala',
	official_name: 'Scala'
    },
    "text/x-kotlin": {
	leetcode_slug: 'kotlin',
	official_name: 'Kotlin'
    },
    'text/x-python': {
	leetcode_slug: 'python3',
	official_name: 'Python3'
    },
    'text/javascript': {
	leetcode_slug: 'javascript',
	official_name: 'JavaScript'
    },
    'text/typescript': {
	leetcode_slug: 'typescript',
	official_name: 'TypeScript'
    },
    'text/x-swift': {
	leetcode_slug: 'swift',
	official_name: 'Swift'
    },
    'text/x-rustsrc': {
	leetcode_slug: 'rust',
	official_name: 'Rust'
    },
    'text/x-php': {
	leetcode_slug: 'php',
	official_name: 'PHP'
    },
    'text/x-go': {
	leetcode_slug: 'golang',
	official_name: 'Go'
    },
};


const MATE_MONACO_THEME = [];

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'; MATE_MONACO_THEME.push('material-darker');
import 'codemirror/theme/monokai.css'; MATE_MONACO_THEME.push('monokai');
import 'codemirror/theme/monokai-mate.css'; MATE_MONACO_THEME.push('monokai-mate');
import 'codemirror/theme/darcula.css'; MATE_MONACO_THEME.push('darcula');
import 'codemirror/theme/material.css'; MATE_MONACO_THEME.push('material');
import 'codemirror/theme/eclipse.css'; MATE_MONACO_THEME.push('eclipse');

require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/python/python.js');
require('codemirror/mode/rust/rust.js')
require('codemirror/mode/go/go.js')
require('codemirror/mode/swift/swift.js')
require('codemirror/mode/php/php.js')
require('codemirror/keymap/emacs.js')
require('codemirror/keymap/sublime.js')
require('codemirror/keymap/vim.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/edit/closebrackets.js')
require('codemirror/addon/comment/comment.js')
require('codemirror/addon/selection/active-line.js')


function MateEditor(props) {
    
    return (
	<CodeMirror
	    id = "mate"
            ref = { props.inputRef }
            value = { props.state.editor.value }
	    options={ props.settings }
	    editorDidMount ={ async (editor) => {
		editor.setSize(props.W, props.H - 90);
		editor.addKeyMap({"Ctrl-/": 'toggleComment'});
		editor.getWrapperElement().style['font-size'] = props.settings.fontsize;
		editor.getWrapperElement().style['line-height'] = (parseInt(props.settings.fontsize) + 5).toString() + "px";

		{/* if (props.focus) {
		    editor.focus();
		    } */}

		if (props.state1.layout.focus.monaco) {
		    editor.focus();
		}
		    
		editor.setCursor(props.cursor);
		
		if (props.state.editor.selection != undefined) {
		    editor.doc.setSelection(props.state.editor.selection.anchor, props.state.editor.selection.head);
		}
		editor.scrollTo(props.state.editor.scrollx, props.state.editor.scrolly);

		if (props.init == false) {
		    if (props.task == null || props.task == undefined) {
			return;
		    }
		    const session = await readSession(props.task.data.question.questionId);
		    const lang = MATE_EDITOR_LANGUAGE[editor.getOption("mode")].leetcode_slug;
		    props.dispatch.global({type: 'RESET_MATE', ref: props.inputRef, value: session.code[lang]});
		    props.setInit(true);
		}
		
		editor.refresh();
	    }}
            onChange = {props.onChange}
	/>);
}



const theme = createMuiTheme({
  palette: {
    text: {
      primary: "#FFFFFF"
    }
  },
    typography: {
    useNextVariants: true,
    subtitle2: {
      color: "white",
    }
  }
});




export const MonacoDialog = (props) => {
    const [openSetting, setOpenSetting] = React.useState(false);
    const inputRef = props.inputRef;
    const [pos, setPos] = React.useState({x: 0, y:0})
    const [widthMonaco, setWidthMonaco] = React.useState(800);
    const [heightMonaco, setHeightMonaco] = React.useState(1000);
    const cursor = props.cursor;
    const setCursor = props.setCursor;
    const dispatch = props.dispatch;
    const [init, setInit] = React.useState(false);



    React.useEffect(async () => {	
	setTimeout(async () => {
	    while (true) {		
		const saved = await new Promise((resolve, fail) => {
		    setTimeout(() => {
			if (inputRef != null && inputRef.current != undefined) {
			    chrome.runtime.sendMessage({action: "SESSION_UPDATE_CODE", payload: {
				code: inputRef.current.editor.getValue(),
				lang: MATE_EDITOR_LANGUAGE[inputRef.current.editor.getOption("mode")].leetcode_slug,
				pid: props.task.data.question.questionId
			    }}, async function(response) {
				resolve(response.status);
			    });
			}
			else {
			    resolve("[session] no mate editor found");
			}
		    }, 5000);
		});
		console.log(saved);
	    }
	}, 10000);
    }, []);


    const onStop = (e, data) => {

	if (pos.x == data.lastX && pos.y == data.lastY) {
	    console.log('monaco stop: no rerender');
	    return;
	}
	else {
	    console.log('monaco stop: rerender');
	    setPos({x: data.lastX, y: data.lastY});
	    return;
	}
    };

    
    const onStart = (e, data) => {
	/* console.log(e); */
	props.onClick(e, false);
	return;
    };

    
    const onResizeStop = (e, dir, ref) => {
	setHeightMonaco(parseInt(ref.style.height))
	setWidthMonaco(parseInt(ref.style.width));
	return false;
    };

    
    const onResize = (e, dir, ref) => {
	const width = parseInt(ref.style.width);
	const height = parseInt(ref.style.height);
	inputRef.current.editor.setSize(width, height - 90);
	return false;
    };

    

    const handleReset = () => {
	if (props.inputRef.current != undefined || props.inputRef.current != null) {
	    const matched_item = props.task.data.question.codeSnippets.find(x => {
		return x.langSlug === MATE_EDITOR_LANGUAGE[props.editorSettings.mode].leetcode_slug;
	    });
	    
	    if (matched_item != undefined && matched_item != null) {
		withValidRef(inputRef, () =>  dispatch.global({type: 'RESET_MATE', ref: inputRef.current, value: matched_item.code}))();
	    }

	}
    };

    
    const handleSetting = () => {
	setOpenSetting(true);
    };


    const MainComponent = () => {
	return (
	    <>
		<div id = "mate-editor">
 		    <MateEditor code = { props.stateGlobal.editor.value }  onChange = { props.onCodeChange } W = {widthMonaco} H = {heightMonaco} HRatio = { props.HRatio }                           state = { props.stateGlobal}
		                init = {init} setInit = {(x) => setInit(x)}
				cursor = { props.stateGlobal.editor.cursor }
				settings = {props.editorSettings}
                                focus = { props.focus }
		                task = { props.task}
		                state1 = {props.state1}
		                dispatch = {props.dispatch}
				inputRef = {props.inputRef} />
		</div>
	    </>
	);
    };


    const handleLoadSaved = async () => {
	if (props.task == null || props.task == undefined) {
	    console.log('no task');
	    return;
	}
	withValidRef(inputRef, async () => {
	    const session = await readSession(props.task.data.question.questionId);
	    const lang = MATE_EDITOR_LANGUAGE[props.editorSettings.mode].leetcode_slug;
	    dispatch.global({type: 'RESET_MATE', ref: inputRef, value: session.code[lang]});
	})();
    };
    


    const ActionComponent = () => {
	return (
	    <>
		<DialogActions style = {{height: "55px"}}>
		    <ThemeProvider theme={props.theme}>
			<MonacoControlPanel
			    id = "control-panel-monaco"
			    setInit = { (x) => {setInit(x)}}
			    editorRef = { props.inputRef }
			    settings = { props.editorSettings }
			    handleChange = { props.handleChange }
			/>
			<Button variant = "contained"  size = "small" onClick = { handleLoadSaved } color="primary">
 			    Load Saved
 			</Button>
 			<Button variant = "contained"  size = "small" onClick = { handleSetting } color="primary">
 			    Settings
 			</Button>
			<Button variant = "contained"  size = "small" onClick = { handleReset } color="primary">
 			    Reset
 			</Button>
			<Button variant = "contained"  size = "small" onClick = { props.handleTest } color="primary">
 			    Test
 			</Button>
			<Button variant = "contained"  size = "small" onClick = { props.handleTestAll } color="primary">
 			    Test All
 			</Button> 
			<Button variant = "contained"  size = "small" onClick = { props.handleSubmit } color="primary">
 			    Submit
 			</Button>
		    </ThemeProvider>
 		</DialogActions>
	    </>
	);
    };


    
    if (props.open == false) {
	return null;
    }

    return (
	<>	
	    <>
		<MateDialogRND W = {widthMonaco} H = {heightMonaco} onResize = {onResize} onResizeStop = {onResizeStop}
			       minWidth = {600} minHeight = {800}
		               onStart = {onStart}
		               zindex = {props.state1.layout.zindex.monaco}
			       MainComponent = {MainComponent} ActionComponent = {ActionComponent}
		               onClick = {props.onClick}
			       title = {props.task.data.question.questionFrontendId + "." + props.task.data.question.title}
			       onClose = {props.handleClose} open = {props.open} id = {props.id} onStop = {onStop} position = {pos}
		/>

	    </>
	    <>
		<MateEditorConfig open = { openSetting } onClose = {() => { setOpenSetting(false); }}
				  config = {props.editorSettings} onChange = { props.handleChange }
		/>
	    </>
	    </>
    );
	};

export { MATE_MONACO_THEME, MATE_EDITOR_LANGUAGE};
