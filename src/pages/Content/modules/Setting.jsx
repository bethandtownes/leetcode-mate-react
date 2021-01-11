import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { useReducer, useRef, useEffect } from 'react';
import EditorSettings from "./EditorSettingGroup.jsx";

function PaperComponent(props) {
    return (
	<Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
	    <Paper {...props} />
	</Draggable>
    );
}

export default function DraggableDialog(props) {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
	props.onClose();
    };

    return (
	<>
	    <Dialog
		open={props.open}
		onClose={handleClose}
		PaperComponent={PaperComponent}
		aria-labelledby="draggable-dialog-title"
	    >
		<DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
		    Settings
		</DialogTitle>
		<DialogContent>
		    <>
			<EditorSettings />
		    </>
		</DialogContent>
		<DialogActions>
		    <Button autoFocus onClick={handleClose} color="primary">
			Cancel
		    </Button>
		    <Button onClick={handleClose} color="primary">
			Subscribe
		    </Button>
		</DialogActions>
	    </Dialog>
	</>
    );
}
