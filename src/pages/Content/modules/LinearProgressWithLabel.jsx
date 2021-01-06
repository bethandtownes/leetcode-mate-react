
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, LinearProgress } from '@material-ui/core';

export default function LinearProgressWithLabel(props) {
    return (
	<Box display="flex" alignItems="center">
	    <Box width="100%" mr={1}>
		<LinearProgress variant="determinate" {...props} />
	    </Box>
	    <Box minWidth={35}>
		<Typography style = {{color: "white"}}>
		    {`${Math.round(props.value,)}%`}
		</Typography>
	    </Box>
	</Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

