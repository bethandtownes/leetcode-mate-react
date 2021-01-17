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
import { ID } from './utility.js';



const makeDraggagblePaper = (props) => {
    return (innerProps) => {
	return (
	    <Draggable
		id = {ID() }
		position = {props.position}
		handle= { "#" + props.id.toString() }
		onStop = { (e, data) => props.onStop(e, data) }
		cancel={'[class*="MuiDialogContent-root"]'}
            >
		<Paper id = { ID() } {...innerProps} />
            </Draggable>	    
	);
    };
};


const valueOrDefault = (props, or) => {
    if (props == null || props == undefined) {
	return or;
    }
    else {
	return props;
    }
}




export function MateDialog(props) {
    const [pos, setPos] = React.useState({x: 0, y:0})
    const defaultResize = (e, dir, ref) => {
	return;
    }
    const defaultResizeStop = (e, dir, ref) => {
	return;
    }
    const onStop = (e, data) => {
	if (e.toElement.toString().match("SVG") != null || e.toElement.toString().match("Button") != null) {
	    return; 
	}
	setPos({x: data.lastX, y: data.lastY});
	// prevent unmount
	return false;
    };

    const MainContent = () => {
	if (props.full == undefined || props.full == false) {
	    return (
		<>
		    { props.mainContent }
		</>
	    );
	}
	else {
	    return (
		<DialogContent>
		    { props.mainContent }
		</DialogContent>
	    );
	}
    };
    
    return (
	<Dialog
	    open={props.open}
	    id = {ID()}
	    hideBackdrop = {true}
	    disableAutoFocus = {true}
	    disableEnforceFocus
	    style={{ pointerEvents: 'none'}}  
	    disableBackdropClick = {true}
	    onClose={ props.onClose }
	    maxWidth={ false }
	    PaperComponent = { makeDraggagblePaper({...props, onStop : onStop, position: pos}) }
	    PaperProps={{ style: {backgroundColor: 'rgba(0,0,0,0.9)', pointerEvents: 'auto'}}}
	    aria-labelledby = {"dialog-" + ID().toString()}
	>
	    <div style={{ overflow: "hidden"}}>
		<Resizable
		    size = {{width: props.W, height: props.H}}
		    minWidth = {props.minW}
		    minHeight = {props.minH}
		    onResize = { valueOrDefault(props.onResize, defaultResize) }
		    onResizeStop = { valueOrDefault(props.onResizeStop, defaultResizeStop) }
		>
		    <>
			<DialogTitle
 			    style={{ cursor: 'move', height: "30px" }}
			    id= {props.id}
			    disableTypography = {true}
 			>
			    <Box id = {ID()} display = "flex" p = {1} >
				<Box id = {ID()} p = {1} flexGrow={1} ml = {-3} mt = {-3} >
				    <Typography variant="subtitle2" style = {{color: "white"}}>
					{ props.dialogName }
				    </Typography>
				</Box>
				<Box id = {"close" + props.id.toString()} p = {1} mr = {-6} mt = {-4.8} >
				    <IconButton id = {"close" + props.id.toString()} onClick={ props.onClose } >
					<FiberManualRecordIcon id = {"close" + props.id.toString()} style = {{color:"#f50057"}} />
				    </IconButton>
				</Box>
			    </Box>
 			</DialogTitle>
			<MainContent />
			{ props.dialogActions }
		    </>
		</Resizable>
	    </div>
	</Dialog>
    );
};
