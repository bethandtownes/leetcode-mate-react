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

import CancelIcon from '@material-ui/icons/Cancel';

import Switch from '@material-ui/core/Switch';

import { Select, MenuItem } from "@material-ui/core";

import { MateDialog } from "./MateWindow.jsx";
import { ID } from "./utility.js";
import { BootstrapInput } from "./helper-components/BootstrapInput.jsx";

import { MATE_MONACO_THEME } from "./MonacoEditor.jsx";


const MATE_EDITOR_OPTIONS = {
    'theme': {
	displayName: "Theme"
    },
    'autoCloseBrackets' : {
	displayName: "Auto Close Brackets"
    },
    'lineWrapping' : {
	displayName: "Line Wrapping"
    },
    'cursorBlinkRate' : {
	displayName: "Cursor Blinking"
    },
    'matchBrackets' : {
	displayName: "Match Brackets"
    },
    'lineNumbers' : {
	displayName: "Display Line Numbers"
    },
    'indentUnit' : {
	displayName: "Indent Size"
    },
    'keyMap': {
	displayName: "Key Binding"
    },
    'fontsize': {
	displayName: "Font Size"
    }
};

const MATE_EDITOR_FONTSIZES = [...Array(11).keys()].map((x) => x + 10).map(x => x.toString() + 'px');



function OptionTrueFalse(props) {
    return (
	<>
	    <Box display = "flex" p = {1} >
		<Box p = {1}  mt = {1} flexGrow={1} >
		    <Typography variant="subtitle2" style = {{color: "white"}}>
			{ MATE_EDITOR_OPTIONS[props.name].displayName }
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


function OptionChooser(props) {
    return (
	<>
	    <Box id = {ID()} display = "flex" p = {1} >
		<Box id = {ID()} p = {1}  mt = {1} flexGrow={1} >
		    <Typography id = {ID()} variant="subtitle2" style = {{color: "white"}}>
			{ MATE_EDITOR_OPTIONS[props.name].displayName }
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


export default function MateEditorConfig(props) {
    const config = React.useState(props.config);
    
    React.useEffect(() => {
	if (config == undefined || config == null) {
	    // TODO: load config from google storage
	}
    }, []);
    


    const mainContent = () => {
	const [state, setState] = React.useState({
	    autoCloseBrackets: true,
	    checkedB: true,
	});
	

	return (
	    <>
		<OptionTrueFalse name = "autoCloseBrackets" onChange = {props.onChange} checked = { props.config.autoCloseBrackets }/>
		<OptionTrueFalse name = "lineWrapping" onChange = {props.onChange} checked = {props.config.lineWrapping} />
		<OptionTrueFalse name = "cursorBlinkRate" onChange = {props.onChange} checked = {props.config.cursorBlinkRate > 0} />
		<OptionTrueFalse name = "matchBrackets" onChange = {props.onChange} checked = {props.config.matchBrackets} />
		<OptionTrueFalse name = "lineNumbers" onChange = {props.onChange} checked = {props.config.lineNumbers} />
		<OptionChooser name = "indentUnit" onChange = {props.onChange} value = {props.config.indentUnit} options = {[2, 4, 8]}/>
		<OptionChooser name = "keyMap" onChange = {props.onChange} value = {props.config.keyMap} options = {["default", "emacs", "vim"]}/>
		<OptionChooser name = "theme" onChange = {props.onChange} value = {props.config.theme} options = {MATE_MONACO_THEME}/>
		<OptionChooser name = "fontsize" onChange = {props.onChange} value = {props.config.fontsize} options = {MATE_EDITOR_FONTSIZES} />
	    </>
	    
	);
    };


    const onResize = () => {
    }

    return <MateDialog
               id = { ID() }
	       dialogName = "MateEditor Config"
               mainContent = { mainContent() }
               dialogActions = { null }
               W = {500} minW = {500}
               resizable = {false}
               open = { props.open } onClose = { props.onClose } 
    />
}
