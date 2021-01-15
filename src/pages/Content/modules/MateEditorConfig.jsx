
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

import { MateDialog } from "./MateWindow.jsx";
import { ID } from "./utility.js";


export default function MateEditorConfig(props) {

    const [config, setConfig] = React.useState(props.config);
    
    
    React.useEffect(() => {
	if (config == undefined || config == null) {
	    // TODO: load config from google storage
	}
    }, []);



    const mainContent = () => {
	const [state, setState] = React.useState({
	    checkedA: true,
	    checkedB: true,
	});

	const handleChange = (event) => {
	    setState({ ...state, [event.target.name]: event.target.checked });
	};

	return (
	    <div>
		<Box display = "flex" p = {1} >
		    <Box p = {1} flexGrow={1} >
			<Typography variant="subtitle2" style = {{color: "white"}}>
			    { "HAHAH" }
			</Typography>
		    </Box>
		    <Box p = {1}  >
			<Switch
			    checked={state.checkedA}
			    onChange={handleChange}
			    name="checkedA"
			    inputProps={{ 'aria-label': 'secondary checkbox' }}
			/>
		    </Box>
		</Box>

		

		
	    </div>
	);
    };


    const onResize = () => {
    }

    return <MateDialog
               id = { ID() }
	       dialogName = "MateEditor Config"
               mainContent = { mainContent() }
               dialogActions = { null }
               W = { 500 } H = { 500 } minW = { 500 } minH = { 500 }
               onResize = { onResize } 
               open = { props.open } onClose = { props.onClose } 
    />
}
