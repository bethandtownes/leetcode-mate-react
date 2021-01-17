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

import {Rnd} from 'react-rnd'


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
		editor.refresh();
	    }}
            onChange = {props.onChange}
	/>);
}

const useStyles = makeStyles((theme: Theme) => ({
    resizable: {
        position: 'relative',
        '& .react-resizable-handle': {
            position: 'absolute',    
            width: 20,  
            height: 20,   
            bottom: 0,
            right: 0,
            background:"url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
            'background-position': 'bottom right',
            padding: '0 3px 3px 0',
            'background-repeat': 'no-repeat',
            'background-origin': 'content-box',
            'box-sizing': 'border-box',
            cursor: 'se-resize',
        },
    },
}))



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

	    // handle="#draggable-dialog-title2"
const DraggablePaperComponent = (props) => {
    const paperProps = Object.fromEntries(Object.entries(props)
					  .filter(([k, v]) => k !=  'onStop' && k != 'position'));
    console.log(paperProps);
    return (
	<Draggable
	    onStop = {(e, data) => { props.onStop(e, data) }}
	    position = { props.position }
	    handle = { '#draggable' + props.id.toString() }

	    cancel={'[class*="MuiDialogContent-root"]'}
	>
            <Paper {...paperProps} />
	</Draggable>

    )
}




const MateDialogRND = (props) => {

}




export const MonacoDialog = (props) => {
    const classes = useStyles();
    const [openSetting, setOpenSetting] = React.useState(false);
    const [task, setTask] = React.useState(props.task);
    const [code, setCode] = React.useState("");

    const inputRef = props.inputRef;
    const [pos, setPos] = React.useState({x: 0, y:0})
    const [drag, setDrag] = React.useState(false);
    const [widthMonaco, setWidthMonaco] = React.useState(600);
    const [heightMonaco, setHeightMonaco] = React.useState(800);

    const onStop = (e, data) => {
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
				
				settings = {props.editorSettings}

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
		<Dialog
		    open={props.open}
 		    hideBackdrop = {true}
 		    disableAutoFocus = {true}
 		    disableEnforceFocus
 		    style={{ pointerEvents: 'none'}}  
 		    disableBackdropClick = {true}
 		    onClose={props.handleClose}
 		    maxWidth={false}
 		    PaperComponent={ DraggablePaperComponent }
 		    PaperProps={{ id: props.id, position: pos, onStop: onStop,  style: {backgroundColor: 'rgba(0,0,0,0.9)', pointerEvents: 'auto'}}}
 		    aria-labelledby="draggable-dialog-title"
		>

		    <div style={{ overflow: "hidden"}}>
 			<Resizable
			    size = {{width: widthMonaco, height:heightMonaco}}
			    minWidth = {600}
			    id = {"mateDialogEditor"}
			    minHeight = {800}
 			    onResize = {onResize}
			    onResizeStop = {onResizeStop}
 			>
			    <>
				<DialogTitle
 				    style={{ cursor: 'move', height: "30px" }}
				    id= {"draggable" + props.id.toString()}
				    disableTypography = {true}
 				>
				    <Box display = "flex" p = {1} >
					<Box p = {1} flexGrow={1} ml = {-3} mt = {-3} >
					    <Typography variant="subtitle2" style = {{color: "white"}}>
						{ props.task.data.question.questionFrontendId + "." + props.task.data.question.title }
					    </Typography>
					</Box>
					<Box p = {1} mr = {-6} mt = {-4.8} >
					    <IconButton onClick={ props.handleClose } >
						<FiberManualRecordIcon style = {{color:"#f50057"}} />
					    </IconButton>
					</Box>
				    </Box>
 				</DialogTitle>
				<MainComponent />
				<ActionComponent />
			    </>
 			</Resizable>
		    </div>

 		</Dialog>
	    </>
	    <>
		<MateEditorConfig open = { openSetting } onClose = {() => { setOpenSetting(false); }}
				  config = {props.editorSettings} onChange = { props.handleChange }/>
	    </>
	</>
    );
};


export { MATE_MONACO_THEME, MATE_EDITOR_LANGUAGE};
