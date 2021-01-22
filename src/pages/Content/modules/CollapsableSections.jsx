import * as React from "react";
import { render } from "react-dom";

import { Container, Section, Bar, Resizer } from "react-simple-resizer";


import useResizeAware from 'react-resize-aware';

const sectionStyle = {
    background: "rgba(255, 255, 255, 0)"
};

const barStyle = {
    background: "white"
};

const MIN_SIZE = 150;

function beforeApplyResizer(resizer: Resizer): void {
    if (resizer.getSectionSize(0) < MIN_SIZE / 2) {
	resizer.resizeSection(0, { toSize: 0 });
    } else if (resizer.getSectionSize(0) < MIN_SIZE) {
	resizer.resizeSection(0, { toSize: MIN_SIZE });
    }
}

export function CollapseSections(props) {

    /* const containerRef = React.useRef(); */

    const containerRef = props.containerRef;
    /* const topSecRef = React.useRef(); */
    
    /* const [H1, setH1] = React.useState(props.H / 2);
     * const [H2, setH2] = React.useState(props.H / 2); */

    const H1 = props.layout.sizeContainer.H1;
    const H2 = props.layout.sizeContainer.H2;
    const update = props.update;
    const layout = props.layout;

    const containerStyle = {
	userSelect: "none",
	fontSize: "16px",
	height: props.H - 85,
	width: props.W,
	fontFamily: "sans-serif",
	textAlign: "center",
	whiteSpace: "nowrap"
    };

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


    const onStatusChanged = (data) => {
    }


    const afterResizing = () => {
	const container = containerRef.current;
	if (container) {
	    const resizer = container.getResizer();
	    const sizes = resizer.resizeResult.sizeInfoArray.map(x => x.currentSize);
	    update.layout({
		...layout,
		barPos: sizes[0],
		sizeContainer: {
		    H1: sizes[0],
		    H2: sizes[2]
		}
	    });
	    console.log(sizes);
	}
    }

    
    return (
	<section>
	    <Container
		vertical = {true}
		style={containerStyle}
		ref={containerRef}
		beforeApplyResizer={beforeApplyResizer}
		afterResizing = {afterResizing}
	    >
		<Section style={sectionStyle} innerRef = {props.topSecRef}
		    	 defaultSize = {props.layout.barPos} >
		    <props.UpperSection  H = {H1} update = {update} />
		</Section>
		<Bar size={10} onClick={onBarClick} style={barStyle} onStatusChanged = {onStatusChanged}/>
		<Section style={sectionStyle} >
		    <props.LowerSection H = {H2} update = {update} />
		</Section>
	    </Container>
	</section>
    );
}

