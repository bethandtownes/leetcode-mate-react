
import React from 'react';
import ReactDOM from 'react-dom';
import { Divider, Box, TextField } from '@material-ui/core';
import { valueOr } from "./utility.js"


export default function InputOutputExpectedPane(props) {
    return  (
	<Box display = "flex" flexDirection ="column" style = {{height: "100%", width: "100%"}} >
	<TextField
	id="input_text_area"
	key = {"input_text_area_key"}
		label="Input"
		defaultValue = { props.state.input }
		multiline = { true }
		inputRef = { props.inputRef }
		readOnly = { false }
		rows = {20}
		variant = "filled"
		style = {{width:"100%", height:"34%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
		{...props}
	    >
	    </TextField>
	    <Divider/>
	    <TextField
		id = "outlined-multiline-static"
		key = {"output_text_area_key"}
		label = "Output"
		value = {valueOr(props.state.output, "")}
		multiline = {true}
		rows = {20}
		variant = "filled"
          	readOnly = {true}
		style = {{width:"100%", height:"33%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
  	        {...props}
	    />
	    <Divider/>
	    <TextField
                id="outlined-multiline-static"
		key = {"expected_text_area_key"}
                label="Expected"
		value = {valueOr(props.state.expected, "")}
		readOnly = {true}
                multiline = {true}
                rows = {20}
                variant = "filled"
                style = {{width:"100%", height:"33%", backgroundColor: 'rgba(255,255,255,0.8)', overflow: 'auto'}}
                {...props}
	    />
	</Box>);
};
