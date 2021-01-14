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
import { ResizableBox } from 'react-resizable'

import { DraggableCore } from 'react-draggable';


import { ThemeProvider } from "@material-ui/styles";
import MonacoControlPanel from "./MonacoEditorControlPanel.jsx";
import {UnControlled as CodeMirror} from 'react-codemirror2'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CancelIcon from '@material-ui/icons/Cancel';


import '../../../../node_modules/codemirror/lib/codemirror.css'
import '../../../../node_modules/codemirror/theme/material-darker.css'

import "ace-builds/src-noconflict/theme-github";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp.js";
import "ace-builds/src-noconflict/mode-csharp.js";
import "ace-builds/src-noconflict/mode-javascript.js";
import "ace-builds/src-noconflict/mode-typescript.js";
import "ace-builds/src-noconflict/mode-rust.js";
import "ace-builds/src-noconflict/mode-golang.js";
import "ace-builds/src-noconflict/mode-php.js";
import "ace-builds/src-noconflict/mode-python.js";
import "ace-builds/src-noconflict/mode-scala.js";
import "ace-builds/src-noconflict/mode-sql.js";
import "ace-builds/src-noconflict/mode-swift.js";


require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/python/python.js')
require('codemirror/keymap/emacs.js')
require('codemirror/keymap/sublime.js')
require('codemirror/keymap/vim.js')


function cMateEditor(props) {
    return (<CodeMirror
                ref = { props.inputRef }
                value = { props.code }
		options={{
		    mode: "text/x-c++src",
		    theme: 'material-darker',
		    lineNumbers: true
		}}

		editorDidMount ={(editor) =>{
		    editor.setSize(props.W + 12, props.H + 4);
		}}
                onChange = {props.onChange}
    />);
}



function MateEditor(props) {
    return (<AceEditor
		mode="java"
		theme="github"
		name="UNIQUE_ID_OF_DIV"
		height = {"inherit"}
		width = {"inherit"}
		editorProps={{ $blockScrolling: true }}
                ref = { props.inputRef }
                value = { props.code }
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


const PaperComponent2 = (props) => {
    return (
        <Draggable
            handle="#draggable-dialog-title2"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    )
}


export const MonacoDialog = (props) => {
    const classes = useStyles();
    const [code, setCode] = React.useState("");
    
    const handleReset = () => {
	console.log(props.task.data.question.codeSnippets.find((e) => { return e.langSlug == MATE_LANGUAGE_SLUG[props.editorSettings.mode] ; }));
    };

    
    return (
	<div>
	    {props.open && (
		<Dialog
		    open={props.open}
 		    hideBackdrop = {true}
 		    disableAutoFocus = {true}
 		    disableEnforceFocus
 		    style={{ pointerEvents: 'none'}}  
 		    disableBackdropClick = {true}
 		    onClose={props.handleClose}
 		    maxWidth={false}
 		    PaperComponent={PaperComponent2}
 		    PaperProps={{ style: {backgroundColor: 'rgba(0,0,0,0.6)', pointerEvents: 'auto'}}}
 		    aria-labelledby="draggable-dialog-title"
		>

		    <DialogTitle
 			style={{ cursor: 'move', height: "30px"}}
			id="draggable-dialog-title2"
			disableTypography = {true}
 		    >
			<Box display = "flex" p = {1} >
			    <Box p = {1} flexGrow={1} ml = {-3} mt = {-3} >
				<Typography variant="subtitle2" style = {{color: "white"}}>
				    { props.task.data.question.questionFrontendId + "." + props.task.data.question.title }
				</Typography>
			    </Box>
			    <Box p = {1} mr = {-4} mt = {-4.8} >
				<IconButton onClick={ props.handleClose } >
				    <FiberManualRecordIcon style = {{color:"#f50057"}} />
				</IconButton>
			    </Box>
			</Box>
 		    </DialogTitle>
 		    <ResizableBox
			height= { props.H  }
			width= { props.W + 12}
 			onResize = {props.onResizeMonoco}
			minConstraints = {[props.W + 12, props.H]}
			className={classes.resizable}
 		    >
			<>			    
 			    <MateEditor code = { props.code }  onChange = { props.onCodeChange } W = {props.W} H = {props.H}
					settings = {props.editorSettings}
			    inputRef = {props.inputRef} currentCode = { code } />
			    
			</>
 		    </ResizableBox>

		    
		    <DialogActions style = {{height: "55px"}}>
			<ThemeProvider theme={props.theme}>
			    <MonacoControlPanel
			    id = "control-panel-monaco"
			    editorRef = { props.inputRef }
			    settings = { props.editorSettings }
			    handleChange = { props.handleChange }
			    />
 			    <Button variant = "contained"  size = "small" color="primary">
 				Settings
 			    </Button>
			    <Button variant = "contained"  size = "small" onClick = { handleReset } color="primary">
 				Reset
 			    </Button>
			    <Button variant = "contained"  size = "small" onClick = { props.handleSubmit } color="primary">
 				Submit
 			    </Button>
			</ThemeProvider>
 		    </DialogActions>
 		</Dialog>
	    )}
	</div>
    )
};
