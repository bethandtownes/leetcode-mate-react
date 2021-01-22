import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import useResizeAware from 'react-resize-aware';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import {IconButton, Box, TextField, AppBar, Button, Typography} from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import {ID} from "./utility.js";
import CircularProgress from '@material-ui/core/CircularProgress';

/* const useStyles = makeStyles((theme) => ({
 *   root: {
 *     width: "100%",
 *     height: "100%",
 *     backgroundColor: theme.palette.background.paper,
 *   },
 * })); */
const useStyles = makeStyles({
    root: {
	'&$selected': {
	    backgroundColor: 'red',
	    '&:hover': {
		backgroundColor: 'yellow',
	    }
	},
    },
    selected: {},
});

export default function TestCaseList(props) {
    const classes = useStyles();
    const cases = props.data;
    const state = props.state;
    const update = props.update;
    const layout = props.layout;
    const session = props.session;
    const mainFn = props.mainFn;
    const mainUpdate = props.mainUpdate;


    const refInput = React.useRef();
    const refExpected = React.useRef();
    const refTopWin = props.refTopWin;

    const idString = props.id.toString()


    if (session == null || session.failed_case == undefined) return null;

    function renderRow(prop) {
	const { index, style } = prop;
	const open = layout.openCases[index];
	const edit = layout.edit[index];

	const caseState = state.result_status[index];
	const caseJuding = state.judging[index];

	

	const casedata = session.failed_case[index].split(">SPLIT1@2@3SPLIT<");
	

	const handleClick = () => {
	    update.layout( {
		...layout,
		select: index,
		openCases: (layout.openCases[index] = !open, layout.openCases),
		topScrollTop: refTopWin.current.scrollTop
	    });
	    if (edit) {
		handleSave();
	    }
	};

	const makeCasePreview = () => {
	    return (
		<Box key = {ID()} display = "flex" flexDirection = "column" ml = {2}>
		    <div key = {"case-preview" + idString} style={{overflow: "hidden", textOverflow: "ellipsis", width: props.W - 210}}> 
			<Typography noWrap style = {{fontSize:"9pt", color:"black"}}>
			    {"Input: " + casedata[0]}
			</Typography>
			<Typography noWrap style = {{fontSize:"9pt", color:"black"}}>
			    {"Expected: " + casedata[1]}
			</Typography>
			
		    </div>
		   
		</Box>
	    );
	};

	const handleDelete = async () => {
	    const status = await new Promise((resolve, fail) => {
		chrome.runtime.sendMessage({action: "SESSION_REMOVE_TESTCASE", payload: {
		    pid: mainFn.questionID(),
		    index: index

		}}, async function(response) {
		    resolve(response.status);
		})
	    });
	    mainUpdate.session();
	};


	const handleEdit = async () => {
	    update.layout( {
		...layout,
		edit: (layout.edit[index] = !edit, layout.edit)
	    });
	    console.log('here');
	};

	const handleSave = async () => {
	    if (refInput.current == undefined || refExpected.current == undefined) {
		return;
	    }
	    const newInput = refInput.current.value;
	    const newExpected = refExpected.current.value;
	    
	    update.layout( {
		...layout,
		edit: (layout.edit[index] = !edit, layout.edit)
	    });
	   
	    const status = await new Promise((resolve, fail) => {
		chrome.runtime.sendMessage({action: "SESSION_EDIT_TESTCASE", payload: {
		    pid: mainFn.questionID(),
		    input: newInput,
		    expected: newExpected,
		    index: index
		}}, async function(response) {
		    resolve(response.status);
		})
	    });
	    console.log(status);
	    mainUpdate.session();
	    console.log('here');
	};


	const makeEditButton = () => {
	    if (edit == false) {
		return (
		    <Box key = {ID()} mt = {2} mr={4.5}>
			<IconButton onClick={ handleEdit } size="small" key = {"edit-button" + props.id.toString()}>
			    <EditIcon key = {ID()} style = {{color:"#1976d2"}} />
			</IconButton>
		    </Box>
		);
	    }
	    else {
		return (
		    <Box key = {ID()} mt = {2} mr={4.5}>
			<IconButton onClick={ handleSave } size="small" key = {"save-button" + props.id.toString()}>
			    <SaveIcon key = {ID()} style = {{color:"#1976d2"}} />
			</IconButton>
		    </Box>
		);
	    }
	}

	const makeDeleteButton = () => {
	    return (
		<Box key = {ID()} mt = {2} ml={-5}>
		    <IconButton key = {"cancel-button" + idString} onClick={ handleDelete } size="small">
			<CancelIcon key = {ID()} style = {{color:"red"}} />
		    </IconButton>
		</Box>
	    );
	}


	const makeRunButton = () => {
	    if (caseJuding) {
		return (
		    <Box key = {ID()} ml = {1} mt = {1.3} >
			<CircularProgress />
		    </Box>
		);
		
	    }
	    else {
		console.log(state);
		return (
		    <Box key = {ID()} ml = {1} mt = {1.6} >
			<Button key = {ID()} size= "small" variant= "contained" color="primary">
			    Run
			</Button>
		    </Box>
		);
	    }
	}


	const makeOutput = () => {
	    if (caseState == undefined) {
		return "";
	    }
	    
	    if (caseState.result_status == "Test Didn't Pass") {
		return caseState.output[0];
	    }
	    else {
		return '[' + caseState.result_status + ']';
	    }
	    
	};


	const makeBackgroundColor = () => {
	    if (caseState == undefined) {
		return "#eeeeee";
	    }
	    else if (caseState.result_status == "Test Didn't Pass" || caseState.result_status == "Compile Error" || caseState.result_status == "Runtime Error") {
		return "pink";
	    }
	    else if (caseState.result_status == "Test Passed") {
		return "#b2ff59";
	    }
	    
	};



	const makeHeader = () => {
	    return (
		<Typography style = {{color:"black"}}>
		    {"Case: " + index.toString()}
		</Typography>
	    );
	};



	return (
	    <>
		<Box key = {ID()} display = "flex" flexDirection = "row" style = {{backgroundColor: makeBackgroundColor()}}>
		    {makeRunButton()}

		    <ListItem key = {"listitem" + index.toString() + props.id} button
			      onClick={handleClick}
			      style = {{width:layout.size.W - 130}}>
			<Box key = {ID()} ml = {0}>
			    <ListItemText key = {"listitem" + index.toString() + idString} primary= {makeHeader()} />
			</Box>
			{makeCasePreview()}

			<div key = {ID()} style= {{flex:"1 0 0"}} />			
			<Box key = {ID()} ml = {-3} mt = {1.3}>
			    {open ? <ExpandLess style={{color:"black"}}/> : <ExpandMore style={{color:"black"}}/>}
			</Box>	
		    </ListItem>
		    <div key = {ID()} style= {{flex:"1 0 0"}} />

		    <Box key = {ID()} display = "flex" flexDirection = "row">
			{makeEditButton()}
			{makeDeleteButton()}
		    </Box>
		</Box>
		
		<Collapse in={open} timeout="auto" unmountOnExit key = {"collapse" + idString}>
		    <List component="div" disablePadding key = {"droplist" + idString}>
			<ListItem button key = {"droplistitem" + idString}>
			    <TextField  defaultValue = {casedata[0]} variant = "filled"
					inputRef = { refInput }
					multiline = {true} rows = {20} label = "Input"
			    InputProps={{
				readOnly: !edit
			    }}
					key = {"input_text" + props.id}
					style = {{width:"100%", height:"180px", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
			    />
			    <TextField  defaultValue = {casedata[1]} variant = "filled"
					inputRef = { refExpected }
					key = {"exptected_text" + props.id}
					multiline = {true} rows = {20} label = "Expected"
					InputProps={{
					    readOnly: !edit
					}}
					style = {{width:"100%", height:"180px", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}

			    />
			    <TextField  value = {makeOutput()} variant = "filled"			
					multiline = {true} rows = {20} label = "Actual Output"
			    		key = {"output_text" + props.id}
					readOnly = {true}
					style = {{width:"100%", height:"180px", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}

			    />
			</ListItem>
		    </List>
		</Collapse>
	    </>
	);
    }


    return (
	<>
	    <div key = "testlist" ref = {refTopWin} 
		style = {{ overflow: "overlay", width:"100%", height:layout.sizeContainer.H1, backgroundColor: "rbga(0, 0, 0, 0.3)"}}>
		{session.failed_case.map((x, i) => renderRow({index:i, style:null}))}
	    </div>
	</>
    );
}
