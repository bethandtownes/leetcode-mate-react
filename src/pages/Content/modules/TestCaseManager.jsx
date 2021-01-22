
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
import { UnControlled as CodeMirror } from 'react-codemirror2'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CancelIcon from '@material-ui/icons/Cancel';
import MateEditorConfig from "./MateEditorConfig.jsx";
import { MateDialog } from "./MateWindow.jsx";
import { ID } from "./utility.js"
import { MateDialogRND } from './MateDialogRnd.jsx';

import TestCaseList from "./TestCaseLists.jsx"

import {runtestN} from "../../../lib/runtest.js";
import {CollapseSections} from "./CollapsableSections.jsx";
import { TestCaseInfo } from "./TestCaseInfoPanel.jsx"





// use default theme
// const theme = createMuiTheme();


export const TestCaseManager = (props) => {

    if (props.session == false) return null;

    const session = props.session;
    
    const [pos, setPos] = React.useState({x: 0, y:0})
    const [W, setW] = React.useState(600);
    const [H, setH] = React.useState(800);
    const [listW, setListW] = React.useState(W);
    const [openView, setOpenView] = React.useState(true);
    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

   
    const [select, setSelect] = React.useState(0);  


    const [layout, setLayout] = React.useState({
	select: 0,
	size: {H: 800, W: 600},
	sizeContainer: {H1:400, H2:400},
	position: {x:0, y: 0},
	barPos: 400,
	openCases: Array(100).fill(false),
	edit: Array(100).fill(false),
	topScrollTop: 0,
	lower: {
	    tabId: 0
	}
    });

    const [state, setState] = React.useState({
	judging: session.failed_case.map(x => false),
	result_status: session.failed_case.map(x => undefined)
    });
    
    const topSecRef = React.useRef();
    const refContainer = React.useRef();
    const refTopWin = React.useRef();
    
    const mainUpdate = props.mainUpdate;
    const mainFn = props.mainFn;

    const task = props.task;


    // address the scroll position
    React.useEffect(() => {
	if (refTopWin.current != undefined) {
	    refTopWin.current.scrollTop = layout.topScrollTop;
	}
    }, [layout]);

    const onStop = (e, data) => {
	setLayout({
	    ...layout,
	    barPos: topSecRef.current.clientHeight,
	    topScrollTop: refTopWin.current.scrollTop,
	    position: {x: data.lastX, y:data.lastY}
	});
	return;
    };

    
    const onStart = (e, data) => {
	return;
    };

    
    const onResizeStop = (e, dir, ref) => {
	setLayout({...layout, size: {
	    H: parseInt(ref.style.height),
	    W: parseInt(ref.style.width)
	}})
	return false;
    };

    
    const [tabId, setTabId] = React.useState(0);

    const onChangeTab = (e, v) => {
	setTabId(v);
    }
    
    
    const onResize = (e, dir, ref) => {

    };


    const Action = () => {
	return (
	    <Typography >
		Test
	    </Typography>
	);

    };


    const getTopScroll = () => {
	if (refTopWin.current == undefined) {
	    return 0;
	}
	else {
	    return refTopWin.current.scrollTop;
	}
    }


    const fnPack = {
	getTopScroll: () => getTopScroll()
    }



    

    const UpperSection = (_props) => {
	return (
	    <TestCaseList mainUpdate = {props.mainUpdate} mainFn = {props.mainFn} layout = {layout}
	                  refTopWin = {refTopWin}
	                  id = {ID()}
			  W = {layout.size.W} H = {_props.H}  state = { state }
			  session = {props.session} update = {_props.update} />
	);

    };


    const LowerSection = (_props) => {
	return (
	    <TestCaseInfo W = {layout.size.W} H = {_props.H} tabId = {tabId} onChangeTab = {onChangeTab} layout = {layout}
	                  update = {_props.update}
	                  fnPack = { fnPack }
			  state = { state } select = { select }
	                  session = {props.session}
	                  fnPack = {fnPack}
	    />
	);
    }

   

    const MainComponent = () => {
	return (
	    <CollapseSections topSecRef = {topSecRef} containerRef = { refContainer}
			      W = {layout.size.W} H = {layout.size.H} UpperSection = {UpperSection} LowerSection = {LowerSection} layout = {layout}
	                      update = {{
				  layout: x => setLayout(x),				  
			      }}
	    />
	);
    };


    const handleRunAll = async() => {
	setState({
	    judging: state.judging.map(x => true),
	    result_status: state.result_status.map(x => undefined)
	});
	forceUpdate();
	
	await Promise.all(session.failed_case.map(async (x, index) => {
	    const casedata = x.split(">SPLIT1@2@3SPLIT<");
	    const n = await runtestN(casedata[0], task);
	    setState({
		judging: (state.judging[index] = false, state.judging),
		result_status: (state.result_status[index] = n, state.result_status)
	    });
	    forceUpdate();
	}));

    };


    const handleRunAllBulk = async() => {
	const combinedCases = session.failed_cases.join('\n');
	const result = await runtestN(combinedCases, task);
	console.log(result);
    };

    const handleAdd = async() => {
	const status = await new Promise((resolve, fail) => {
	    chrome.runtime.sendMessage({action: "SESSION_INSERT_TESTCASE", payload: {
		pid: mainFn.questionID(),
	    }}, async function(response) {
		resolve(response.status);
	    })
	});
	mainUpdate.session();
    };
	
	const ActionComponent = () => {
	return (
	    <>
		<DialogActions style = {{height: "55px"}}>
		    <ThemeProvider theme={props.theme}>
			<Button variant = "contained"  size = "small" onClick = { handleAdd } color="primary">
 			    Add
 			</Button>
			<Button variant = "contained"  size = "small" onClick = { handleRunAll } color="primary">
 			    RunAll(Parallel)
 			</Button>
			<Button variant = "contained"  size = "small" onClick = { handleRunAllBulk } color="primary">
 			    RunAll
 			</Button>
		    </ThemeProvider>
 		</DialogActions>
	    </>
	);
    };


    
    if (props.open == false) {
	return null;
    }

    return (
	<>
	    <Box display="flex" flexDirection="column">
		<>
		    <MateDialogRND W = {layout.size.W} H = {layout.size.H} onResize = {onResize} onResizeStop = {onResizeStop}
				   minWidth = {600} minHeight = {800}
				   onStart = {onStart}
				   MainComponent ={ MainComponent} ActionComponent = {ActionComponent}
				   onClick = {props.onClick}
				   zIndex = {2000}
				   title = {"Test Case Manager"}
				   onClose = {props.onClose} open = {props.open} id = {props.id} onStop = {onStop} position = {layout.position}
		    />
		</>
		
	    </Box>
	    
	</>
    );
};

