import React from 'react';
import ReactDOM from 'react-dom';



const viewport = document.getElementById('app');

const app = document.createElement('div');

app.id = 'root';

if (viewport) viewport.prepend(app);

import Toolbar from '@material-ui/core/Toolbar';

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
// import TextareaAutosize from 'react-textarea-autosize'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { ResizableBox } from 'react-resizable';
import { Divider } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useReducer, useRef } from 'react';


import { DEBUG } from "../../lib/debug.js";
import { injectJSListener } from "../../lib/utils.jsx";

import * as acquire from "../../lib/acquire.js";
import { submit } from "../../lib/action.js";

injectJSListener();

const PaperComponent = (props: PaperProps) => {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper style = {{backgroundColor: "rgba(0,0,0,0.3)"}} {...props} />
        </Draggable>
    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style = {{backgroundColor: 'rgba(255,255,255,0.6)'}}
            {...other}
        >
            {value === index && (
		<div {...other}>
                    {children}
		</div>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function valueOr(x, other) {
    if (x == null || x == undefined) {
	return other;
    }
    else {
	return x;
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'submit': {
	    console.log('action payload');
	    console.log(action.payload);
	    return action.payload;
	    /* return { task_type: null,
	       result_status: null,
	       input: null,
	       output: null,
	       expected: null,
	       msg_compile_error: "haha",
	       msg_runtime_error: null,
	       msg_debug: null
	       }; */
        }
        case 'run_custom_case' : {
	    /* return handleUpdate(); */
        }
        case 'run_default_case' : {
	    return ;
	}
	case 'user_update_input': {
	    return { task_type: null,
		     result_status: null,
		     input: null,
		     output: null,
		     expected: null,
		     msg_compile_error: null,
		     msg_runtime_error: null,
		     msg_debug: null,
		     user_input: action.payload };
	    
	}
	case 'close' : {
	}
        default: {
            throw new Error("unexpected action type");
        }
    }
}

 function DialogComponent(props) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const textRef = useRef();

    const initialState = {
	task_type: null,
        result_status: null,
	input: null,
	output: null,
	expected: null,
	msg_compile_error: "init",
	msg_runtime_error: null,
	msg_debug: null
    };
    
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleClickOpen = () => {
        setOpen(true)
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const InputOutputExpectedPane = () => {
        return  (
	    <Box display = "flex" flexDirection ="column" style = {{width: "30%"}}>
		<TextField
                    id="input_text_area"
		    key="input_text_area_key"
                    label="Input"
		    defaultValue={"init"}
                    multiline={true}
		    inputRef={textRef}
                    rows={10}
                    variant="filled"
                    style={{width:"100%", height:"100%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
		>
		</TextField>
		<Divider/>
		<TextField
		    id="outlined-multiline-static"
		    key="output_text_area_key"
		    label="Output"
		    multiline={true}
		    rows={10}
		    variant="filled"
          	    readOnly = {true}
		    style={{width:"100%", height:"100%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
		/>
		<Divider/>
		<TextField
                    id="outlined-multiline-static"
		    key="expected_text_area_key"
                    label="Expected"
		    readOnly = {true}
                    multiline={true}
                    rows={10}
                    variant="filled"
                    style={{width:"100%", height:"100%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
		/>
	    </Box>);
    };

    const DebugMessagePane = () => {
        return (
            <>
		<Box display = "flex" flexDirection ="column" style = {{width: "70%"}}>
                    <AppBar position="static" style={{ height:"30px", width: "100%"}}>
			<Tabs value={value} onChange={handleChange}
                              variant='fullWidth'
                              aria-label="simple tabs example"
                              style={{minHeight:"30px",
                                      height:"30px",
                                      width:"100%"}}>
			    <Tab label="stdout"
				 style={{minHeight:"30px", height:"30px", width:"50%"}}
				 variant='fullWidth' {...a11yProps(0)}
			    />
			    <Tab label="error message"
				 style={{minHeight:"30px", height:"30px", width:"50%"}}
				 variant='fullWidth'
				 {...a11yProps(1)} />
			</Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}
                              style = {{height:"100%", width:"100%"}}>
			<textarea value = {"stdout"}
			          readOnly = {true}
				  key="stdout_text_area_key"
				  style={{resize: "none",
					  height:"100%",
					  backgroundColor: 'rgba(255,255,255,0.7)',
					  width: "100%"}}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}
                              style = {{height:"100%", width:"100%"}}>
			<textarea
			    value = {(() => {
				return state.msg_compile_error;
			    })() }
			    key="error_message_text_area_key"
                   	    readOnly = {true}
			    style={{resize: "none",
				    height:"100%",
				    backgroundColor: 'rgba(255,255,255,0.7)', width: "100%"}}/>
                    </TabPanel>
		</Box>
            </>
        );
    };

//		    {/* console.log(textRef.current.value);
//			textRef.current.value = "changed";
//			console.log(textRef.current.value); */}
    const Actions = () => {
        return (
            <>
		<Button onClick={() => dispatch({type : 'run_default'})} color="primary">
	            Run Default Case
		</Button>
		<Button onClick={() => dispatch({type : 'run_custom'})} color="primary">
	            Run
		</Button>
		<Button onClick={async () => {
		    const res = await submit(state);
		    console.log('res is d  d asdsaasddasdasd: ');
		    console.log(res);
		    dispatch({type: 'submit', payload: res});
		}}
		    color="primary">
	            Submit
		</Button>
		<Button onClick={() => dispatch({type : 'cancel'})} color="primary">
	            Close
		</Button>
            </>
        );
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
                    PaperProps={{ style: {backgroundColor: 'rgba(0,0,0,0.6)', pointerEvents: 'auto'}}}
                    aria-labelledby="draggable-dialog-title"
		>
                    <ResizableBox
			/* className={classes.resizable} */
			height = {600}
			width = {600}
			minConstraints = {[600, 600]}
		    >
			<>
			    <DialogTitle
				style={{ cursor: 'move' , backgroundColor: "pink"}}
				id="draggable-dialog-title"
			    >
				{valueOr(state.task_type, "Run or Submit")}
				{(() => {
				    if (state.task_type == "submit" && state.result_status == "accepted") {
					return null;
				    }
				    else {
					return <h5> submission detail </h5>;
				    }
				})()}
			    </DialogTitle>
			    <Divider />
			    <DialogContent style = {{height: "75%"}}>
				<Box display = "flex" flexDirection = "row" style = {{height: "100%", alignItems: "stretch"}}>
				    <InputOutputExpectedPane/>
				    <DebugMessagePane/>
				</Box> 
			    </DialogContent>
			    <DialogActions >
				<Actions />
			    </DialogActions>
			</>
                    </ResizableBox>
		</Dialog>
            )}
        </div>
    )
}
// Render the <App /> component.
ReactDOM.render(<DialogComponent />, document.getElementById('root'));
console.log(document);


