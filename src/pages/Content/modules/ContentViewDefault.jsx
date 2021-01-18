import React from 'react';
import PaneTitle from "./PaneTitle.jsx";
import { Divider, Box, DialogContent } from "@material-ui/core";
import { ResizableBox } from 'react-resizable';
import { Container, Section, Bar, Resizer} from 'react-simple-resizer';
import { InputOutputExpectedPane } from "./InputOutputExpectedPane.jsx";
import { DebugMessagePane } from "./DebugMessagePane.jsx";

const MIN_SIZE = 150;

function beforeApplyResizer(resizer: Resizer): void {
  if (resizer.getSectionSize(0) < MIN_SIZE / 2) {
    resizer.resizeSection(0, { toSize: 0 });
  } else if (resizer.getSectionSize(0) < MIN_SIZE) {
    resizer.resizeSection(0, { toSize: MIN_SIZE });
  }
}
export const ContentViewDefault = (props) => {
    const containerRef = React.useRef();

    const onBarClick = () => {
	const container = containerRef.current;

	if (container) {
	    const resizer = container.getResizer();

	    if (resizer.getSectionSize(0) === 0) {
		resizer.resizeSection(0, { toSize: MIN_SIZE });
	    }
	    container.applyResizer(resizer);
	}
    };

    const percentageHfix = () => {
	if (props.W <= 620) {
	    return "90%";
	}
	if (props.W < 650) {
	    return "95%";
	}
	else {
	    return "98%";
	}
    };

    return (
	<ResizableBox
	    height = {props.H}
	    width = {props.W}
	    minConstraints = {[600, 400]}
	    onResizeStop ={ props.XX }
	>
	    <>
		<PaneTitle state = { props.state } loading = { props.loading }
			   mode = { props.mode } failed = { props.failed } />
		<Divider />
		<DialogContent style = {{height: "90%"}}>
		    <Container style = {{height: percentageHfix(), width:"100%"}}
			       ref = {containerRef}
			       beforeApplyResizer = { beforeApplyResizer }
		    >
			<Section
			    key = "section1"
			    defaultSize = {props.barPos}
			    disableResponsive = {true}
			    style = {{height: "100%", width:"100%"}}
			    innerRef = {props.barRef}
			>
			    <InputOutputExpectedPane  zIndex = {props.zIndex}
						      state = {props.state} inputRef = { props.inputRef }
						      mode = { props.mode } inputCursor = {props.inputCursor} refs = {props.refs}/>
			</Section>
			<Bar size = { 10 } onClick = { onBarClick } style={{ background: '#888888', cursor: 'col-resize' }} />
			<Section style = {{height: "100%", width:"100%"}}
				 key = "section2"
			>
			    <DebugMessagePane refs = {props.refs} stdoutRef = {props.stdoutRef} value = {props.tabID} state = {props.state} onChange = { props.handleTabChange } />
			</Section>
		    </Container>
		</DialogContent>
	    </>
	</ResizableBox>
    );
};
