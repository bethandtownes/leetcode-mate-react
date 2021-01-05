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
import { submit, runtest } from "../../lib/action.js";
import {T, ResultType, TaskType } from "../../lib/typings.js";
import LinearProgress from '@material-ui/core/LinearProgress';


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

const rndtyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

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
	case T.action.update: {
	    return action.payload;
	}
	case T.action.update_input: {
	    return {
		task_type: state.task_type,
		result_status: state.result_status,
		input: action.payload,
		output: state.output,
		expected: state.expected,
		msg_compile_error: state.msg_compile_error,
		msg_runtime_error: state.msg_runtime_error,
		msg_debug: state.msg_debug,
	    };
	}
        case T.action.run_default_case : {
	    return ;
	}
        default: {
	    return state;
        }
    }
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function DialogComponent(props) {
    const [open, setOpen] = React.useState(false);
    const [mode, setMode] = React.useState(null);
    const [value, setValue] = React.useState(0);
    const textRef = useRef();
    const [judge, setJudge] = React.useState(false);

    const initialState = {
	task_type: null,
        result_status: null,
	input: "",
	output: "",
	expected: "",
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
	const v = textRef.current.value;
        setValue(newValue);
	dispatch({ type: T.action.update_input, payload: textRef.current.value });
    };

    const classes = useStyles();
    

    const InputOutputExpectedPane = () => {
        return  (
	    <Box display = "flex" flexDirection ="column" style = {{width: "30%"}}>
		<TextField
		    id="input_text_area"
		    key = {"input_text_area_key"}
		    label="Input"
		    defaultValue = { state.input }
		    multiline = { true }
		    inputRef = { textRef }
		    readOnly = { false }
		    rows = {10}
		    variant = "filled"
		    style = {{width:"100%", height:"100%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
		>
		</TextField>
		<Divider/>
		<TextField
		    id = "outlined-multiline-static"
		    key = {"output_text_area_key"}
		    label = "Output"
		    value = {valueOr(state.output, "")}
		    multiline = {true}
		    rows = {10}
		    variant = "filled"
          	    readOnly = {true}
		    style = {{width:"100%", height:"100%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
		/>
		<Divider/>
		<TextField
                    id="outlined-multiline-static"
		    key = {"expected_text_area_key"}
                    label="Expected"
		    value = {valueOr(state.expected, "")}
		    readOnly = {true}
                    multiline = {true}
                    rows = {10}
                    variant = "filled"
                    style = {{width:"100%", height:"100%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
		/>
	    </Box>);
    };

    const DebugMessagePane = () => {
	
	const renderErrorMsg = () => {
	    switch (state.result_status) {
		case ResultType.compile_error: {
		    return state.msg_compile_error;
		}
		case ResultType.runtime_error: {
		    return state.msg_runtime_error;
		}
		default : {
		    return "";
		}
	    }
	};
	
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
			<textarea value = { state.msg_debug }
			          readOnly = {true}
				  key = {"stdout_text_area_key"}
				  style={{resize: "none",
					  height:"100%",
					  backgroundColor: 'rgba(255,255,255,0.7)',
					  width: "100%"}}/>
                    </TabPanel>
                    <TabPanel value={value} index={1}
                              style = {{height:"100%", width:"100%"}}>
			<textarea
		            value = { renderErrorMsg() }
			    key = {"error_message_text_area_key"}
                   	    readOnly = {true}
			    style={{resize: "none",
				    height:"100%",
				    backgroundColor: 'rgba(255,255,255,0.7)', width: "100%"}}/>
                    </TabPanel>
		</Box>
            </>
        );
    };

    const  handleTitleChange = () => {
	dispatch({ type: T.action.update_input, payload: textRef.current.value });
    };

    
    const Actions = () => {
	const handleRunCustom = async () => {
	    if (state.result_status == T.result.accepted) {
		setMode("test");
		return;
	    }
	    if (textRef.current.value.trim() == "") {
		return;
	    }
	    
	    dispatch({ type: T.action.update_input, payload: textRef.current.value });
	    setMode("test"); 
	    setJudge(true);
	    let res = await runtest(textRef.current.value.trim());
	    res.input = textRef.current.value;
	    setJudge(false);
	    dispatch({ type: T.action.update, payload: res });
	};

	const handleSubmit = async () => {
	    dispatch({ type: T.action.update_input, payload: "" });
	    setMode("submit");
	    setJudge(true);
	    const res = await submit(state);
	    setJudge(false);
	    dispatch({type: T.action.update, payload: res});
	};

	const handleRunDefault = async () => {
	    if (state.result_status == T.result.accepted) {
		setMode("test");
		/* return; */
	    }
	    const defaultCase = await acquire.DefaultTestCase();
	    textRef.current.value = defaultCase;
	    dispatch({ type: T.action.update_input, payload: textRef.current.value });
	    setMode("test"); 
	    setJudge(true);
	    let res = await runtest(textRef.current.value.trim());
	    res.input = textRef.current.value;
	    setJudge(false);
	    dispatch({ type: T.action.update, payload: res });
	};

	const loadingBar = () => {
	    if (judge == true) {
		return (
		    <div className={classes.root}>
			<LinearProgress />
		    </div>
		);
	    }
	    else {
		return null;
	    }
	};
	
        return (
            <>
		{loadingBar()}
		<Button onClick = { handleRunDefault } color="primary"> Run Default </Button>
		<Button onClick = { handleRunCustom } color="primary"> Run </Button>
		<Button onClick = { handleSubmit } color="primary"> Submit </Button>
		<Button onClick={() => dispatch({type : 'cancel'})} color="primary">
	            Close
		</Button>
            </>
        );
    };


    const SubmissionDetails = () => {
	if (state.result_status != T.result.accepted) {
	    return null;
	}
	return (
	    <>
		
	    </>
	);
    };


    const PaneTitle = () => {
	const renderStatus = () => {
	    if (mode == null) {
		return "Run or Submit";
	    }
	    if (mode == "submit") {
		return state.result_status;
	    }

	    else {
		return state.result_status;
	    }
	};

	const makeBackgroundColor = () => {
	    if (state.result_status == T.result.accepted) {
		return "green";
	    }
	    else {
		return "pink";
	    }
	};
	    

	const renderMode = () => {
	    if (mode == null) {
		return "";
	    }
	    else if (mode == "test") {
		return "(test mode)";
	    }
	    else {
		return  "(submit mode)";
	    }
	};
	return (
	    <>
		<DialogTitle
		    style={{ cursor: 'move' , backgroundColor: makeBackgroundColor(), width: "800"}}
		    id="draggable-dialog-title"
		>
		    {renderStatus()}
		    {renderMode()}
		</DialogTitle>  
	    </>
	);
    };

    const renderHeight = () => {
	if (state.result_status == T.result.accepted && mode == "submit") {
	    return 500;
	}
	else {
	    return 500;
	}
    };

    const MiddleContent = () => {
	if (state.result_status == T.result.accepted && mode == "submit") {
	    return (
		<ResizableBox
		    height = {150}
		    width = {800}
		    minConstraints = {[800, 150]}
		>
		    <PaneTitle />
		    
		</ResizableBox>
	    );
	    /* return null; */
	}
	else {
	    return (
		<ResizableBox
		    height = {renderHeight()}
		    width = {800}
		    minConstraints = {[800, renderHeight()]}
		>
		    <>
			<PaneTitle />
			<Divider />
			<DialogContent style = {{height: "90%"}}>
			    <Box display = "flex" flexDirection = "row" style = {{height: "100%", alignItems: "stretch"}}>
				<InputOutputExpectedPane/>
				<DebugMessagePane/>
			    </Box> 
			</DialogContent>
		    </>
		</ResizableBox>
	    );
	}
    }
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
		    <MiddleContent />
		    <DialogActions >
			<Actions />
		    </DialogActions>
		</Dialog>
	    )}
        </div>
    );
}


// Render the <App /> component.
ReactDOM.render(<DialogComponent />, document.getElementById('root'));
console.log(document);


