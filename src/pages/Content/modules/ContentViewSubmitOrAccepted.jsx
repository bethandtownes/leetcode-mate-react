import React from 'react';
import PaneTitle from "./PaneTitle.jsx";
import { Divider, Box, DialogContent } from "@material-ui/core";
import { ResizableBox } from 'react-resizable';
import ProgressBarRuntime from "./ProgressBarRuntime.jsx";
import ProgressBarMemory from "./ProgressBarMemory.jsx";

export default function ConventViewSubmitOrAccepted(props) {
    return (

	    <>
		<PaneTitle submit = {props.submit} state = { props.state } loading = { props.loading } mode = { props.mode } onClose = { props.onClose }/>
		<Divider />
		<DialogContent style = {{height: props.sizes.height - 115}}>
		    <Box display = "flex" flexDirection = "column" style = {{height: "100%", alignItems: "stretch"}}>
			<ProgressBarRuntime loading = {props.loading} state = { props.state } />
			<p/>
			<ProgressBarMemory loading = {props.loading} state = { props.state } />
		    </Box>
		</DialogContent>
	    </>
    );
}
