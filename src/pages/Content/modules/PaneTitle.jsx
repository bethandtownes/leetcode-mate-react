import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import HashLoader from "react-spinners/HashLoader";
import Box from '@material-ui/core/Box';
import { T } from "../../../lib/typings.js";
import BuildIcon from '@material-ui/icons/Build';

export default function PaneTitle(props) {
    const renderStatus = () => {
	const state = props.state;
	if (props.loading == true) {
	    return "Juding";
	}
	if (props.mode == null || state.result_status == null) {
	    return "Run or Submit";
	}
	if (props.mode == "submit") {
	    return state.result_status;
	}
	if (props.mode == "test") {
	    return state.result_status;
	}
	console.log("unknown state");
	return state.result_status;
    };

    const makeBackgroundColor = () => {
	const state = props.state;
	if (props.loading == true) {
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
    
    const ModeIcon = () => {
	if (props.mode == T.mode.test) {
	    return <BuildIcon style = {{marginTop: "4px", marginLeft: "auto"}}/>;
	}
	return null;
    }

    return (
	<>
	    <DialogTitle
		style={{ cursor: 'move' , backgroundColor: makeBackgroundColor(), width: "800"}}
		id="draggable-dialog-title"
	    >
		<Box display = "flex" flexDirection = "row">
		    {renderStatus()}
		    <p/>
		    <Box ml={2} mt={2}>
			<HashLoader size = {25} loading = {props.loading} style = {{marginLeft: "20px"}}/>
		    </Box>
		    <p/>
		    <ModeIcon />
		</Box>

	    </DialogTitle>  
	</>
    );
};
