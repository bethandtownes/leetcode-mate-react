import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Box, Tab, Tabs, Typography, AppBar, Divider } from '@material-ui/core';

import { ResultType } from "../../../lib/typings.js";
import { valueOr } from "./utility.js";
import { TextareaAutosize, TextField} from '@material-ui/core';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`testcase-tabpanel-${index}`}
            aria-labelledby={`testcase-tab-${index}`}
            style = {{backgroundColor: 'rgba(255,255,255,0.6)'}}
            {...other}
        >
            {value === index && (
		<div {...other}>
                    {children}
		</div>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `testcase-tab-${index}`,
        'aria-controls': `testcase-tabpanel-${index}`,
    };
}



export function TestCaseInfo(props) {

    const layout = props.layout;    
    const update = props.update;
    const fnPack = props.fnPack;
    const state = props.state;
    const curCase = state.result_status[layout.select];

    const onChange = (e, tid) => {
	update.layout({
	    ...layout,
	    topScrollTop: fnPack.getTopScroll(),
	    lower: {
		tabId: tid
	    }
	});
    }



    const makeStdout = () => {
	if (curCase == undefined) {
	    return "";
	}
	else {
	    return curCase.msg_debug == null ? "" : curCase.msg_debug;
	}
    };


    const makeErrorMessage = () => {
	if (curCase == undefined) {
	    return "";
	}
	else if (curCase.result_status == "Compile Error") {
	    return curCase.msg_compile_error;
	}
	else if (curCase.result_status == "Runtime Error") {
	    return curCase.msg_runtime_error;
	}
	else {
	    return "";
	}
    }

    return (
        <>
	    <Box display = "flex" flexDirection ="column" style = {{height:"100%", backgroundColor: "rgba(255,255,255,0.7)", width: "100%"}}>
                <AppBar position="static" style={{ height:"30px", width: "100%"}}>
		    <Tabs value={layout.lower.tabId} onChange={onChange}
                          variant='fullWidth'
                          aria-label="testcast-info"
                          style={{minHeight:"30px",
                                  height:"30px",
                                  width:"100%"}}>
			<Tab label="StdOut"
			     style={{minHeight:"30px", height:"30px", width:"50%"}}
			     variant='fullWidth' {...a11yProps(0)}
			/>

			<Tab label="Error Message"
			     style={{minHeight:"30px", height:"30px", width:"50%"}}
			     variant='fullWidth'
			{...a11yProps(1)} />
		    </Tabs>
                </AppBar>
		<TabPanel value={layout.lower.tabId} index={0}
                          style = {{height: props.H, width:"100%", backgroundColor:"rgba(255, 255, 255, 0)"}}>
		    <textarea   value = {makeStdout()}
		                readOnly
			        style = {{fontSize:"10pt",
					  fontColor:"white",
					  width:"100%", height:"100%", backgroundColor: 'rgba(255,255,255,0)', overflow: 'auto'}}

		    />
                </TabPanel>
		<TabPanel value={layout.lower.tabId} index={1}
                          style = {{height: props.H, width:"100%"}}>
		    <textarea   value = {makeErrorMessage()}
		                readOnly
			        style = {{fontSize:"10pt",   color: 'rgb(233, 30, 99)',
					  backgroundColor: 'rgba(252, 228, 236, 0.9)',
				          width:"100%", height:"100%", overflow: 'auto'}}
		    />
                </TabPanel>

	    </Box>
        </>
    );
};
