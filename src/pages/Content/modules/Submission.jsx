import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import { isCN } from "../../../lib/acquire.js";

import { useReducer, useRef, useEffect } from 'react';
import { ID } from "./utility.js"

import { DEBUG } from "../../../lib/debug.js";
import { injectJSListener } from "../../../lib/utils.jsx";

import * as acquire from "../../../lib/acquire.js";
import { submit, submitCN, runtest, runtestCN } from "../../../lib/action.js";
import {T, ResultType, TaskType } from "../../../lib/typings.js";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, CssBaseline, Typography, Box} from "@material-ui/core";

import ContentViewSubmitOrAccepted from "./ContentViewSubmitOrAccepted.jsx";
import { ContentViewDefault }  from "./ContentViewDefault.jsx";
import DraggableDialog from "./Setting.jsx";
import { MonacoDialog } from "./MonacoEditor.jsx";
import LeetCodeMateSettings from "./LeetCodeMateSettings.jsx";
import { MATE_EDITOR_LANGUAGE } from "./MonacoEditor.jsx";


// to do


const PaperComponent = (props: PaperProps) => {
    const paperProps = Object.fromEntries(Object.entries(props)
						.filter(([k, v]) => k !=  'onStop' && k != 'position' && k != 'onStart'));
    return (
        <Draggable
	    position = {props.position}
	    onStop = {props.onStop}
	    onStart = {props.onStart}
	    onClick = {props.onClick}
            handle="#submitpanelc"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper style = {{backgroundColor: "rgba(0,0,0,0.3)"}} {...paperProps} />
        </Draggable>
    )
}


export function Submission(props) {
    const mode = props.mode;
    const judge = props.judge;
    const state = props.state;
    // sizes should be local

    const [barPos, setBarPos] = React.useState(220);
    const barRef = React.useRef();
    
    
    
    const MiddleContent = () => {
	if ((mode == T.mode.submit && judge == true) || (state.result_status == T.result.accepted && mode == T.mode.submit)) {
	    return (
		<ContentViewSubmitOrAccepted loading = { judge }
		                             sizes= {sizes}
		                             submit = {submitPortal}
					     state = { state }
					     mode = { mode }
		/>
	    );
	}
	else {
	    return (
		<ContentViewDefault loading = { judge } state = { state } mode = { mode }
		                    barPos = { barPos } barRef = {barRef}
				    submit = {submitPortal}
		                    zIndex = { props.zIndex.testinput }
		                    sizes = { sizes }
		                    containerRef = {containerRef}
		                    stdoutRef = {props.stdoutRef}
		                    inputCursor = {props.inputCursor }
		                    inputRef = { props.textRef } failed = { props.failed }
		                    tabID = { value } handleTabChange = { props.handleChange }
	        />
	    );
	}
    }
    
    return (
	<>
	    <Dialog
		id={"submission_pane"}
		open={props.open}
		hideBackdrop = {true}
		disableAutoFocus = {true}
		disableEnforceFocus
		style={{ zIndex: props.zIndex, pointerEvents: 'none'}}  
		disableBackdropClick = {true}
		onClose={props.handleClose}
		maxWidth={false}
		PaperComponent={PaperComponent}
		PaperProps={{ onStop: props.onStop, onStart: props.onStart, position: pos, onClick: props.handleClickSubmission, style: {backgroundColor: 'rgba(0,0,0,0.6)', pointerEvents: 'auto'}}}
		aria-labelledby="draggable-dialog-title"
	    >
		<div  style={{ overflow: "hidden"}}>
		    {resizeListener}
		    <Resizable
			size = {{width:props.getW(), height: props.getH() }}
			minHeight = {props.getMinH()}
			minWidth = {props.getMinW()}
			onResizeStop ={ props.onResizeStop }
		    >
			<>
			    <MiddleContent size = {size} />
			    <Box mb={0.5}>
				<DialogActions>
				    <Actions />
				</DialogActions>
			    </Box>
			</>
		    </Resizable>
		</div>
	    </Dialog>
	</>
    );
};
