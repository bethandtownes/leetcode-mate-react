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
import {UnControlled as CodeMirror} from 'react-codemirror2'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { FormGroup, FormControlLabel, FormLabel, withStyles } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import Switch from '@material-ui/core/Switch';
import { Select, MenuItem, FormControl} from "@material-ui/core";
import { MateDialog } from "./MateWindow.jsx";
import { ID } from "./utility.js";
import { BootstrapInput } from "./helper-components/BootstrapInput.jsx";
import { InputBase } from "@material-ui/core";



const BootstrapInput2 = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
    input: {
	width: "40px",
	borderRadius: 4,
	position: 'relative',
	backgroundColor: "white",
	border: '1px solid #ced4da',
	fontSize: 16,
	padding: '0px 0px 0px 0px',
	transition: theme.transitions.create(['border-color', 'box-shadow']),
	// Use the system font instead of the default Roboto font.
	fontFamily: [
	    '-apple-system',
	    'BlinkMacSystemFont',
	    '"Segoe UI"',
	    'Roboto',
	    '"Helvetica Neue"',
	    'Arial',
	    'sans-serif',
	    '"Apple Color Emoji"',
	    '"Segoe UI Emoji"',
	    '"Segoe UI Symbol"',
	].join(','),
	'&:focus': {
	    borderRadius: 4,
	    borderColor: '#80bdff',
	    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
	},
    },
}))(InputBase);


function OptionTrueFalse(props) {
    return (
	<>
	    <Box display = "flex" p = {1} >
		<Box p = {1}  mt = {1} flexGrow={1} >
		    <Typography variant="subtitle2" style = {{color: "white"}}>
			{ props.displayName }
		    </Typography>
		</Box>
		<Box p = {1}  >
		    <Switch
		        id = { ID() }
		    checked={ props.checked }
		    onChange={ props.onChange }
		    name= { props.name }
		    inputProps={{ 'aria-label': 'secondary checkbox' }}
		    />
		</Box>
	    </Box>
	</>
    );
}


function OptionKeyBind(props) {

    const [state, setState] = React.useState({
	mod1: props.keys.mod1,
	mod2: props.keys.mod2,
	key: props.keys.key
    });

    const onChange = async (e) => {
	console.log(e);
	const newState = {...state, [e.target.name]: e.target.value};
	console.log(newState);
	setState(newState);
	props.onChange({
	    target: {
		name: props.name,
		value: newState
	}})
    };
    
     return (
	 <>
	     <Box id = {ID()} display = "flex" p = {1} >
		 <Box id = {ID()} p = {1}  mt = {1} flexGrow={1} >
		     <Typography id = {ID()} variant="subtitle2" style = {{color: "white"}}>
			 { props.displayName }
    		     </Typography>
		 </Box>
		 <Box p = {1}  >
		     <Select
			 id= {ID()}
			 onChange = { onChange }
			 value = { state.mod1 }
			 name = "mod1"
			 style = {{backgroundColor: "white"}}
			 input = {<BootstrapInput id = { ID() } />}
		     >
			 { ["Ctrl", "Alt", "Shift", "Meta", "None"].map(x => { return <MenuItem id = { ID() } value = {x}> {x} </MenuItem>; }) }
		     </Select>
		 </Box>
		 <Box p = {1}>
		     <Select
			 id= {ID()}
			 onChange = { onChange }
			 value = { state.mod2 }
			 name = "mod2"
			 style = {{backgroundColor: "white"}}
			 input = {<BootstrapInput id = {ID()} />}
		     >
			 {  ["Ctrl", "Alt", "Shift", "Meta", "Enter", "None"].map(x => { return <MenuItem id = { ID() } value = {x}> {x} </MenuItem>; }) }
		     </Select>
		 </Box>
		 <Box p = {1}>
		     <FormControl>
			 <BootstrapInput name = "key" id= { ID() }  onChange = { onChange } value = { state.key }/>
		     </FormControl>
		 </Box>
	     </Box>
	 </>
     );
}


function OptionChooser(props) {
    return (
	<>
	    <Box id = {ID()} display = "flex" p = {1} >
		<Box id = {ID()} p = {1}  mt = {1} flexGrow={1} >
		    <Typography id = {ID()} variant="subtitle2" style = {{color: "white"}}>
			{ props.name }
    		    </Typography>
		</Box>
		<Box p = {1}  >
		    <Select
			id= {ID()}
			onChange = { props.onChange }
			value={ props.value } 
			style= {{backgroundColor: "white"}}
			name = {props.name} 
			input= {<BootstrapInput id = {ID()} />}
		    >
			{ props.options.map(x => { return <MenuItem id = { ID() } value = {x}> {x} </MenuItem>; }) }
		    </Select>
		</Box>
	    </Box>
	</>
    );
}




export default function LeetCodeMateSettings(props) {
    const config = React.useState(props.config);
    
    React.useEffect(() => {
	if (config == undefined || config == null) {
	    // TODO: load config from google storage
	}
    }, []);

   

    const mainContent = () => {
	return (
	    <>
		<FormGroup>
		    <FormLabel component ="label">
			<Typography id = {ID()} variant="subtitle2" style = {{color: "pink"}}>
			    { "LeetCode Editor Settings" }
			</Typography>
		    </FormLabel>
		    <Box>
			<Box mt = {-2}>
			    <OptionTrueFalse id = {ID()} name = "autoCloseBrackets" displayName = "Auto Close Brackets"
					     onChange = { props.onChange } checked = { props.settings.editor.autoCloseBrackets }/>
			</Box>
			<Box mt = {-5}>
			    <OptionTrueFalse id = { ID()} name = "blinkingCursor" displayName = "Blinking Cursor"
					     onChange = { props.onChange } checked = { props.settings.editor.blinkingCursor }/>
			</Box>
			<Box mt = {-5}>
			    <OptionTrueFalse id = { ID()} name = "hide" displayName = "Disable Completely"
					     onChange = { props.onChange } checked = { props.settings.editor.hide }/>
			</Box>
		    </Box>
		</FormGroup>
		<FormGroup>
		    <FormLabel component ="label">
			<Typography id = {ID()} variant="subtitle2" style = {{color: "pink"}}>
			    { "Keyboard Shortcuts" }
			</Typography>
		    </FormLabel>
		    <Box>
			
			<Box mt = {-1} display = "flex" flexDirection = "column">
			    <OptionKeyBind id = {ID()} name = "toggleSubmissionPane" displayName = "Toggle Submission Pane"
					   onChange = { props.onChange } keys = { props.settings.keybinding.toggleSubmissionPane } />
			    <OptionKeyBind id = {ID()} name = "toggleMateEditor" displayName = "Toggle Magte Editor"
					   onChange = { props.onChange } keys = { props.settings.keybinding.toggleMateEditor } />
			    <OptionKeyBind id = {ID()} name = "submit" displayName = "Submit"
					   onChange = { props.onChange } keys = { props.settings.keybinding.submit } />
			    <OptionKeyBind id = {ID()} name = "test" displayName = "Test"
					   onChange = { props.onChange } keys = { props.settings.keybinding.test } />
			</Box>
		    </Box>
		</FormGroup>
		
	    </>
	    
	);
    };

    return <MateDialog
               id = { ID() }
	       dialogName = "MateEditor Config"
               mainContent = { mainContent() }
               dialogActions = { null }
               W = {700} minW = {700}    
               resizable = {false}
               open = { props.open } onClose = { props.onClose } 
    />
}
