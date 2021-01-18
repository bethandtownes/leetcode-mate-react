import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Box, Tab, Tabs, Typography, AppBar } from '@material-ui/core';

import { ResultType } from "../../../lib/typings.js";
import { valueOr } from "./utility.js";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function DebugMessagePane(props) {



    

    
    const renderErrorMsg = () => {
	let state = props.state;
	switch (state.result_status) {
	    case ResultType.compile_error: {
		return state.msg_compile_error;
	    }
	    case ResultType.runtime_error: {
		return state.msg_runtime_error;
	    }
	    default : {
		return "";
	    }
	}
    };

    return (
        <>
	    <Box display = "flex" flexDirection ="column" style = {{height:"100%", width: "100%"}}>
                <AppBar position="static" style={{ height:"30px", width: "100%"}}>
		    <Tabs value={props.value} onChange={props.onChange}
                          variant='fullWidth'
                          aria-label="simple tabs example"
                          style={{minHeight:"30px",
                                  height:"30px",
                                  width:"100%"}}>
			<Tab label="stdout"
			     style={{minHeight:"30px", height:"30px", width:"50%"}}
			     variant='fullWidth' {...a11yProps(0)}
			/>
			<Tab label="error message"
			     style={{minHeight:"30px", height:"30px", width:"50%"}}
			     variant='fullWidth'
			{...a11yProps(1)} />
		    </Tabs>
                </AppBar>
                <TabPanel value={props.value} index={0}
                          style = {{height:"100%", width:"100%"}}>
		    <textarea value = { valueOr(props.state.msg_debug, "") }
			      readOnly = {true}
		              ref = { props.stdoutRef }
		              id = {'textarea_stdout'}
			      key = {"stdout_text_area_key"}
			      style={{resize: "none",
				      height:"100%",
				      backgroundColor: 'rgba(255,255,255,0.7)',
				      width: "100%"}}/>
                </TabPanel>
                <TabPanel value={props.value} index={1}
                          style = {{height:"100%", width:"100%"}}>
		    <textarea
		        value = { renderErrorMsg() }
			key = {"error_message_text_area_key"}
		    	id = {'textarea_errmsg'}
                        readOnly = {true}
		        ref = { props.refs.err }
		    style={{resize: "none",
			    height:"100%",
			    color: 'rgb(233, 30, 99)',
			    backgroundColor: 'rgba(252, 228, 236, 0.9)', width: "100%"}}/>
                </TabPanel>
	    </Box>
        </>
    );
};
