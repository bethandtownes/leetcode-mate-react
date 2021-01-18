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


function MateEditor(props) {
    return (
	<CodeMirror
            ref = { props.inputRef }
            value = { props.code }
	    options={ props.settings }
	    editorDidMount ={(editor) => {
		editor.setSize(props.W, props.H - 90);
		editor.addKeyMap({"Ctrl-/": 'toggleComment'});
		editor.getWrapperElement().style['font-size'] = props.settings.fontsize;
		if (props.focus) {
		    editor.focus();
		}
		editor.setCursor(props.cursor);
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
    const [task, setTask] = React.useState(props.task);
    const [code, setCode] = React.useState("");

    const inputRef = props.inputRef;
    const [pos, setPos] = React.useState({x: 0, y:0})
    const [drag, setDrag] = React.useState(false);
    const [widthMonaco, setWidthMonaco] = React.useState(600);
    const [heightMonaco, setHeightMonaco] = React.useState(800);
    /* const [cursorPos, setCursorPos] = React.useState({line: 1, ch: 1, sticky: null}); */
    const [cursor, setCursor] = React.useState({line: 1, ch: 1, sticky: null});

    

    const onStop = (e, data) => {
	setPos({x: data.lastX, y: data.lastY});
	return;
    };

    
    const onStart = (e, data) => {
	setCursor(inputRef.current.editor.getCursor());
	props.save();
	setPos({x: data.lastX, y: data.lastY});
	return;
    };

    const handleReset = () => {
	console.log('[mate editor] reset');
	if (props.inputRef.current != undefined || props.inputRef.current != null) {
	    const matched_item = props.task.data.question.codeSnippets.find(x => {
		return x.langSlug === MATE_EDITOR_LANGUAGE[props.editorSettings.mode].leetcode_slug;
	    });
	    if (matched_item != undefined && matched_item != null) {
		props.inputRef.current.editor.setValue(matched_item.code);
		props.save();
	    }

	}
    };

    const handleClick = () => {
	/* const zIndex = props.zIndexPair.zIndex;
	   props.saveInput(); */
	props.onClick();
	setCursorPos(inputRef.current.editor.getCursor());
	props.save();
	/* const curMaxzIndex = Object.entries(zIndex).map(([x, y])=> y).reduce((x, y)=> Math.max(x, y), 0);
	   props.zIndexPair.setzIndex({...zIndex, editor: curMaxzIndex + 500}); */
    };
    
    const handleSetting = () => {
	setOpenSetting(true);
    }


    const onResizeStop = (e, dir, ref) => {
	setHeightMonaco(parseInt(ref.style.height))
	setWidthMonaco(parseInt(ref.style.width));
	setDrag(false);
	return false;
    };
    

    const onResize = (e, dir, ref) => {
	const width = parseInt(ref.style.width);
	const height = parseInt(ref.style.height);
	inputRef.current.editor.setSize(width, height - 90);
	props.save();
	return false;
    };

    const MainComponent = () => {
	return (
	    <>
		<div id = "mate-editor">
 		    <MateEditor code = { props.code }  onChange = { props.onCodeChange } W = {widthMonaco} H = {heightMonaco} HRatio = { props.HRatio }
				cursor = { cursor }
				settings = {props.editorSettings}
                                focus = { props.focus }
				inputRef = {props.inputRef} />
		</div>
	    </>
	);
    };
    


    const ActionComponent = () => {
	return (
	    <>
		<DialogActions style = {{height: "55px"}}>
		    <ThemeProvider theme={props.theme}>
			<MonacoControlPanel
			    id = "control-panel-monaco"
			    zIndex = { props.zIndexPair.zIndex }
			    editorRef = { props.inputRef }
			    settings = { props.editorSettings }
			    handleChange = { props.handleChange }
			/>
 			<Button variant = "contained"  size = "small" onClick = { handleSetting } color="primary">
 			    Settings
 			</Button>
			<Button variant = "contained"  size = "small" onClick = { handleReset } color="primary">
 			    Reset
 			</Button>
			<Button variant = "contained"  size = "small" onClick = { props.handleTest } color="primary">
 			    Test
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
			       MainComponent = {MainComponent} ActionComponent = {ActionComponent}
		               onClick = {handleClick}
		               zIndex = {props.zIndexPair.zIndex.editor}
			       title = {props.task.data.question.questionFrontendId + "." + props.task.data.question.title}
			       onClose = {props.handleClose} open = {props.open} id = {props.id} onStop = {onStop} position = {pos}
		/>

	    </>
	    <>
		<MateEditorConfig open = { openSetting } onClose = {() => { setOpenSetting(false); }}
				  config = {props.editorSettings} onChange = { props.handleChange }
		                  zIndex = {props.zIndexPair.zIndex.editor_settings}
		/>
	    </>
	    </>
    );
	};

export { MATE_MONACO_THEME, MATE_EDITOR_LANGUAGE};
