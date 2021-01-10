import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import HashLoader from "react-spinners/HashLoader";
import Box from '@material-ui/core/Box';
import { T } from "../../../lib/typings.js";
import BuildIcon from '@material-ui/icons/Build';
import Alert from '@material-ui/lab/Alert';
import { CountdownCircleTimer } from "react-countdown-circle-timer";


const timerProps = {
  isPlaying: true,
  size: 40,
  strokeWidth: 3
};

const renderTime = (time) => {
  return (
      <div className = "time-wrapper">
	  <div> {time} </div>
      </div>
  );
};

const getTimeSeconds = (r, time) => (r - time / 1000) | 0;

function CooldownTimer() {
  const stratTime = Date.now() ; // use UNIX timestamp in seconds
  const endTime = stratTime + 3; // use UNIX timestamp in seconds

  const remainingTime = endTime - stratTime;
  return (
    <div>
      <CountdownCircleTimer
        {...timerProps}
        colors={[["#218380"]]}
        duration={remainingTime}
        initialRemainingTime={3}
        onComplete={(totalElapsedTime) => [
          remainingTime - totalElapsedTime > 0
        ]}
      >
      </CountdownCircleTimer>
    </div>
  );
}


export default function PaneTitle(props) {
    const renderStatus = () => {
	const state = props.state;
	if (props.failed == true) {
	    return "Submission Failed, try again in 3 seconds";
	}
	if (props.loading == true) {
	    return "Juding";
	}
	if (props.mode == null || state.result_status == null) {
	    return "Run or Submit";
	}
	if (props.mode == "submit") {
	    if (state.result_status == T.result.runtime_error
		|| state.result_status == T.result.time_limit_exceeded
		|| state.result_status == T.result.wrong_answer
		|| state.result_status == T.result.memory_limit_exceeded) {
		const A = state.total_correct.toString();
		const B = state.total_testcases.toString();
		return state.result_status + " (" + A + "/" + B + ")";
	    }
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
	if (props.failed == true) {
	    return "pink";
	}
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
	if (props.failed == true) {
	    return (
		<Box ml={"auto"}> 
		    <CooldownTimer style = {{marginTop: "4px"}}/>
		</Box>
	    );
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
