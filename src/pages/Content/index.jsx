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
import Draggable from 'react-draggable'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import { ResizableBox } from 'react-resizable';
import { Divider } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useReducer, useRef, useEffect } from 'react';


import { DEBUG } from "../../lib/debug.js";
import { injectJSListener } from "../../lib/utils.jsx";

import * as acquire from "../../lib/acquire.js";
import { submit, runtest } from "../../lib/action.js";
import {T, ResultType, TaskType } from "../../lib/typings.js";
import LinearProgress from '@material-ui/core/LinearProgress';
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, CssBaseline} from "@material-ui/core";
import { Container, Section, Bar } from 'react-simple-resizer';



import HashLoader from "react-spinners/HashLoader";

import InputOutputExpectedPane from "./modules/InputOutputExpectedPane.js";


injectJSListener();


function valueOr(x, other) {
    if (x == null || x == undefined) {
	return other;
    }
    else {
	return x;
    }
}

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
          <Typography style = {{color: "white"}}>
	      {`${Math.round(props.value,)}%`}
	  </Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

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



const initialState = {
    task_type: null,
    result_status: null,
    input: "",
    output: "",
    expected: "",
    status_runtime: null,
    status_memory: null,
    runtime_percentile: null,
    memory_percentile: null,
    msg_compile_error: "init",
    msg_runtime_error: null,
    msg_debug: null
};

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
	case T.action.reinitialize: {
	    return initialState;
	}
        default: {
	    return state;
        }
    }
}


const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});


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
    const [barPos, setBarPos] = React.useState(250);
    const [value, setValue] = React.useState(0);
    const [row, setRow] = React.useState(10);
    const textRef = useRef();
    const barRef = useRef();
    const inputBoxRef = useRef();
    const submitButtonRef = useRef();
    const runButtonRef = useRef();
    const runDefaultButtonRef = useRef();
    
    const [judge, setJudge] = React.useState(false);
 
    
    const [state, dispatch] = useReducer(reducer, initialState);


    useEffect(() => {
	const memorizeBarPos = () => {
	    try {
		if (open) {
		    setBarPos(barRef.current.clientWidth);
		}
	    }
	    catch (e) {
		// do nothing
	    }
	};
	window.addEventListener('click', memorizeBarPos);
	return () => {
	    window.removeEventListener('click', memorizeBarPos);
	}
    });


    useEffect(() => {
	const toggle = (e) => {
	    if (e.altKey && e.key == 'i') {
		if (open) {
		    dispatch({type: T.action.update_input, payload: textRef.current.value});
		    setOpen(false);
		}
		else {
		    setOpen(true);
		}
	    }
	    if (e.ctrlKey && e.key == 'Enter') {
		if (open == false) {
		    setOpen(true);
		}
		submitButtonRef.current.click();
	    }
	    if (e.altKey && e.key == 'Enter') {
		if (open == false) {
		    setOpen(true);
		}
		if (textRef.current == null || textRef.current.value.trim() == "") {
		    runDefaultButtonRef.current.click();
		}
		else {
		    runButtonRef.current.click();
		}
	    }
	    if (e.altKey && e.ctrlKey && e.key == 'Enter') {
		if (open == false) {
		    setOpen(true);
		}
		runDefaultButtonRef.current.click();
	    }
	};
	window.addEventListener('keydown', toggle);
	return () => {
	    window.removeEventListener('keydown', toggle);
	}
    });


    useEffect(() => {
	
    });
    
    const handleClickOpen = () => {
	if (open == false) {
            setOpen(true)
	}
	else {
	    setOpen(false);
	}
    }
    
    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (event, newValue) => {
	console.log(barRef);
	const v = textRef.current.value;
        setValue(newValue);
	dispatch({ type: T.action.update_input, payload: textRef.current.value });
    };

    const classes = useStyles();
    

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
		<Box display = "flex" flexDirection ="column" style = {{height:"100%", width: "100%"}}>
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
				    color: 'rgb(233, 30, 99)',
				    backgroundColor: 'rgba(252, 228, 236, 0.9)', width: "100%"}}/>
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
		dispatch({ type: T.action.reinitialize });
		return;
	    }
	    if (textRef.current == null || textRef.current == undefined || textRef.current.value.trim() == "") {
		return;
	    }
	    
	    dispatch({ type: T.action.update_input, payload: textRef.current.value });
	    setMode("test"); 
	    setJudge(true);
	    let res = await runtest(textRef.current.value.trim());
	    res.input = textRef.current.value;
	    setJudge(false);
	    dispatch({ type: T.action.update, payload: res });
	    if (res.result_status == T.result.compile_error) {
		setValue(1);
	    }
	    else if (res.result_status == T.result.runtime_error) {
		setValue(1);
	    }
	    else {
		setValue(0);
	    }
	};

	const handleSubmit = async () => {
	    dispatch({ type: T.action.update_input, payload: "" });
	    setMode("submit");
	    setJudge(true);
	    const res = await submit(state);
	    setJudge(false);
	    dispatch({type: T.action.update, payload: res});
	    if (res.result_status == T.result.compile_error) {
		setValue(1);
	    }
	    else if (res.result_status == T.result.runtime_error) {
		setValue(1);
	    }
	    else {
		setValue(0);
	    }
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
	    if (res.result_status == T.result.compile_error) {
		setValue(1);
	    }
	    else if (res.result_status == T.result.runtime_error) {
		setValue(1);
	    }
	    else {
		setValue(0);
	    }
	};

	const handleReset = () => {
	    dispatch({ type: T.action.reinitialize });
	}

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
		<Button ref = { runDefaultButtonRef } onClick =  { handleRunDefault } color="primary"> Run Default </Button>
		<Button ref = { runButtonRef } onClick = { handleRunCustom } color="primary"> Run </Button>
		<Button ref = { submitButtonRef } onClick = { handleSubmit } color="primary"> Submit </Button>
		<Button onClick={() => dispatch({type : 'cancel'})} color="primary">
	            Close
		</Button>
		<Button onClick = { handleReset } color="primary"> Reset </Button>
            </>
        );
    };


    const PaneTitle = () => {
	const renderStatus = () => {
	    if (judge == true) {
		return "Juding";
	    }
	    if (mode == null || state.result_status == null) {
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
	    if (judge == true) {
		return '#ffeb3b';
	    }	    
	    if (state.result_status == T.result.accepted || state.result_status == "Test Passed") {
		return "#b2ff59";
	    }
	    if (state.result_status == null) {
		return '#ffeb3b';
	    }
	    return "pink";

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
		    <Box display = "flex" flexDirection = "row">
			{renderStatus()}
			<p/>
			<HashLoader size = {25} loading = {judge} style = {{marginLeft: 10}}/>
		    </Box>
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
	if ((mode == 'submit' && judge == true) ||state.result_status == T.result.accepted && mode == "submit") {
	    const RuntimePercentileBar = () => {
		if (judge == true) {
		    return (
			<>
			    <Typography style={{ marginTop: 0 , color: "white"}}>
				Runtime
			    </Typography>
			    <LinearProgress  style = {{ height: "20px"}}/>
			</>
		    );
		}
		else {
		    return (
			<>
			    <Typography style={{ marginTop: 0 , color: "white"}}>
				Runtime
			    </Typography>
			    <LinearProgressWithLabel value = {state.runtime_percentile} style = {{ height: "20px"}}/>
			</>
		    );
		}
	    };

	    const MemoryPercentileBar = () => {
		if (judge == true) {
		    return (
			<>
			    <Typography style={{ marginTop: 0 , color: "white"}}>
				Memory
			    </Typography>
			    <LinearProgress  style = {{ height: "20px"}}/>
			</>
		    );
		}
		else {
		    return (
			<>
			    <Typography style={{ marginTop: 0 , color: "white"}}>
				Memory
			    </Typography>
			    <LinearProgressWithLabel value = {state.memory_percentile} style = {{ height: "20px"}}/>
			</>
		    );
		}
	    };
	    
	    return (
		<ResizableBox
		    height = {180}
		    width = {800}
		    minConstraints = {[800, 180]}
		>
		    <>
			<PaneTitle />
			<Divider />
			<DialogContent style = {{height: "90%"}}>
			    <Box display = "flex" flexDirection = "column" style = {{height: "100%", alignItems: "stretch"}}>
				<RuntimePercentileBar />
				<p/>
				<MemoryPercentileBar />
			    </Box>
			</DialogContent>
		    </>
		</ResizableBox>
	    );
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
			    {/* <Box display = "flex" flexDirection = "row" style = {{height: "100%", alignItems: "stretch"}}> */}
				<Container style = {{height: "100%", width:"100%"}}>
				    <Section
					key = "section1"
					defaultSize = {barPos}
					minSize = {250}
					disableResponsive = {true}
					style = {{height: "100%", width:"100%"}}
					innerRef = {barRef}
				    >
					<InputOutputExpectedPane state = {state} inputRef = {textRef} />
				    </Section>
				    <Bar size={10} style={{ background: '#888888', cursor: 'col-resize' }} />

				    <Section style = {{height: "100%", width:"100%"}}
					key = "section2"
				    >
					<DebugMessagePane/>
				    </Section>
				</Container>
				{/* </Box>  */}
			</DialogContent>
		    </>
		</ResizableBox>
	    );
	}
    }
    return (
        <div>
	    {open && (
		<Dialog
		    id={"submission_pane"}
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


