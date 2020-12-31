import React from 'react';
import ReactDOM from 'react-dom';

const viewport = document.getElementById('app');

// Create a div to render the <App /> component to.
const app = document.createElement('div');

// Set the app element's id to `root`. This is the same as the element that create-react-app renders to by default so it will work on the local server too.
app.id = 'root';



// Prepend the <App /> component to the viewport element if it exists. You could also use `appendChild` depending on your needs.
if (viewport) viewport.prepend(app);



import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Paper, { PaperProps } from '@material-ui/core/Paper'
import { makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
// import React from 'react'
import Draggable from 'react-draggable'
import TextareaAutosize from 'react-textarea-autosize'

import { ResizableBox } from 'react-resizable'

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

function acquireDefaultTestCase() {
    const e = document.getElementsByClassName("ace_layer ace_text-layer")[0];
    if (e == undefined) {
	// DEBUG("no text case input area found");
	return;
    }
    console.log("called");
    return Array.from(e.children).map(x => x.textContent).join('\n')
}

const PaperComponent = (props: PaperProps) => {
    return (
        <Draggable
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props} />
        </Draggable>
    )
}

function useSubmissionStatus() {
    return null;
}

function handleSubmit() {
    console.log("submit");
}


/* interface DialogProps {
 *     children: JSX.Element[] | JSX.Element
 * } */

function DialogComponent() {
    const [open, setOpen] = React.useState(false);
    
    const handleClickOpen = () => {
        setOpen(true)
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    const classes = useStyles()

      

    const SubmissionArea = () => {
	return <TextareaAutosize>
	    {acquireDefaultTestCase()}
	</TextareaAutosize>;
    };
    
    return (
    <div>
        <Button onClick={handleClickOpen}>Open dd form dialog</Button>
        {open && (
	    <Dialog
                open={true}
		/* BackdropComponent = {document} */
                hideBackdrop = {true}
                disableAutoFocus = {true}
                disableEnforceFocus
                style={{ pointerEvents: 'none'}}
                disableBackdropClick = {true}
                onClose={handleClose}
                maxWidth={false}
                PaperComponent={PaperComponent}
                PaperProps={{ style: {pointerEvents: 'auto'}}}
                aria-labelledby="draggable-dialog-title"
	    >
                <ResizableBox
		    height={400}
		    width={600}
		    className={classes.resizable}
		>
		    <DialogTitle
			style={{ cursor: 'move' }}
			id="draggable-dialog-title"
		    >
			Subscribe
		    </DialogTitle>

		    <DialogContent>
			<SubmissionArea />

			<TextField
			    autoFocus
			    margin="dense"
			    id="name"
			    label="Email "
			    type="email"
			    fullWidth
			/>
		    </DialogContent>

		    <DialogActions>
			<Button onClick={handleClose} color="primary">
			    Cancel
			</Button>
			<Button onClick={handleSubmit} color="primary">
			    Submit
			</Button>
		    </DialogActions>
                </ResizableBox>
	    </Dialog>
        )}
    </div>
    )
}
// Render the <App /> component.
ReactDOM.render(<DialogComponent />, document.getElementById('root'));
console.log(document);

