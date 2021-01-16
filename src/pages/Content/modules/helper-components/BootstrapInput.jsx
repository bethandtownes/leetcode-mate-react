import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';


export const BootstrapInput = withStyles((theme) => ({
    root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
    input: {
	width:"100px",
	borderRadius: 4,
	position: 'relative',
	border: '1px solid #ced4da',
	backgroundColor: "white",
	fontSize: 14,
	textAlign: "center",
	fontColor: "black !important",
	/* padding: '0px 0px 0px 12px', */
	transition: theme.transitions.create(['border-color', 'box-shadow']),
	// Use the system font instead of the default Roboto font.
	fontFamily: [
	    '-apple-system',
	    'BlinkMacSystemFont',
	    '"Segoe UI"',
	    'Roboto',
	    '"Helvetica Neue"',
	    'Arial',
	    'sans-serif',
	    '"Apple Color Emoji"',
	    '"Segoe UI Emoji"',
	    '"Segoe UI Symbol"',
	].join(','),
	'&:focus': {
	    borderRadius: 4,
	    borderColor: '#80bdff',
	    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
	},
    },
}))(InputBase);
