import React from 'react';
import LinearProgressWithLabel from "./LinearProgressWithLabel.jsx";
import { Typography, LinearProgress } from "@material-ui/core";

export default function ProgressBarMemory(props) {
    if (props.loading == true) {
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
		    { "Memory: "  + props.state.status_runtime.toString() }
		</Typography>
		<LinearProgressWithLabel value = {props.state.memory_percentile} style = {{ height: "20px"}}/>
	    </>
	);
    }
};
