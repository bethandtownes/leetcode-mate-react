import React from 'react';
import ReactDOM from 'react-dom';
import { Divider, Box, TextField } from '@material-ui/core';
import { valueOr } from "./utility.js";
import { T } from "../../../lib/typings.js";

export const InputOutputExpectedPane = (props) => {
    
    const renderLabel = () => {
	if (props.mode == T.mode.test) {
	    return "Input (Test)";
	}
	if (props.state.result_status == T.result.wrong_answer) {
	    return "Input (Failed Case)";
	}
	return "Input";
    };
    
    return  (
	<Box display = "flex" flexDirection ="column" style = {{height: "100%", width: "100%"}} >
	    <TextField
		id="input_text_area"
		key = {"input_text_area_key"}
		label = { renderLabel() }
	        defaultValue = { props.state1.inputbox.value }
		inputRef = { props.inputRef }
		multiline = { true }
		readOnly = { false }
		rows = {20}
		variant = "filled"
		style = {{width:"100%", height:"34%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
	    >
	    </TextField>
	    <Divider/>
	    <TextField
		id = "textarea_output"
	        key = {"output_text_area_key"}
	        inputRef = { props.refs.output }
		label = "Output"
		value = {valueOr(props.state.output, "")}
		multiline = {true}
		rows = {20}
		variant = "filled"
          	readOnly = {true}
		style = {{width:"100%", height:"33%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
	    />
	    <Divider/>
	    <TextField
                id="textarea_expected"
		key = {"expected_text_area_key"}
                label="Expected"
	        inputRef = { props.refs.expected }
		value = {valueOr(props.state.expected, "")}
		readOnly = {true}
                multiline = {true}
                rows = {20}
                variant = "filled"
                style = {{width:"100%", height:"33%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
	    />
	</Box>);
};
