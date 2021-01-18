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
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CancelIcon from '@material-ui/icons/Cancel';
import { ID } from "./utility.js"




const DraggablePaperComponent = (props) => {
    const paperProps = Object.fromEntries(Object.entries(props)
					  .filter(([k, v]) => k !=  'onStop' && k != 'position' && k != 'onStart'));
    return (
	<Draggable
	    onStart = {(e, data) => { props.onStart(e, data) }}
	    onStop = {(e, data) => { props.onStop(e, data) }}
	    position = { props.position }
	    handle = { '#draggable' + props.id.toString() }

	    cancel={'[class*="MuiDialogContent-root"]'}
	>
            <Paper {...paperProps} />
	</Draggable>

    )
}



export const MateDialogRND = (props) => {
    return (
	<Dialog
	    open={props.open}
 	    hideBackdrop = {true}
 	    disableAutoFocus = {true}
 	    disableEnforceFocus
 	    style={{ zIndex: props.zIndex, pointerEvents: 'none'}}  
 	    disableBackdropClick = {true}
 	    onClose={props.handleClose}
 	    maxWidth={false}
 	    PaperComponent={ DraggablePaperComponent }
 	    PaperProps={{ onStart: props.onStart, onClick: props.onClick, id: props.id, position: props.position, onStop: props.onStop,  style: {backgroundColor: 'rgba(0,0,0,0.9)', pointerEvents: 'auto'}}}
 	    aria-labelledby="draggable-dialog-title"
	>
	    <div style={{ overflow: "hidden"}}>
 		<Resizable
		    size = {{width: props.W, height:props.H}}
		    minWidth = {props.minWidth}
		    id = {"matedialog" + props.id.toString()}
		    minHeight = {props.minHeight}
 		    onResize = {props.onResize}
		    onResizeStop = {props.onResizeStop}
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
					{props.title}
				    </Typography>
				</Box>
				<Box p = {1} mr = {-6} mt = {-4.8} >
				    <IconButton onClick={ props.onClose } >
					<FiberManualRecordIcon style = {{color:"#f50057"}} />
				    </IconButton>
				</Box>
			    </Box>
			</DialogTitle>
		    </>
		    <props.MainComponent />
		    <props.ActionComponent />
		</Resizable>
	    </div>
 	</Dialog>
    );
}
