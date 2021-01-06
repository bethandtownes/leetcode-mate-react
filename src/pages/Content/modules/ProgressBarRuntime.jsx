import React from 'react';
import LinearProgressWithLabel from "./LinearProgressWithLabel.jsx";
import { Typography, LinearProgress } from "@material-ui/core";

export default function ProgressBarRuntime(props) {
    if (props.loading == true) {
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
		    { "Runtime: " + props.state.status_runtime.toString() }
		</Typography>
		<LinearProgressWithLabel value = {props.state.runtime_percentile} style = {{ height: "20px"}}/>
	    </>
	);
    }
};
