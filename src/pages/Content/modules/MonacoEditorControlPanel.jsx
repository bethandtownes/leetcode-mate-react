import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { makeStyles, withStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { ID } from "./utility.js";
import { MATE_MONACO_THEME } from "./MonacoEditor.jsx";


import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles((theme) => ({
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

const useStyles = makeStyles((theme) => ({
  margin: {
      margin: theme.spacing(1),
  },
}));




const MATE_MONACO_LANGUAGE = ["text/x-c++src", "text/x-csrc", "text/x-java", "text/x-csharp",
			      "text/x-scala", "text/x-kotlin", 'text/x-python', 'text/javascript', 'text/typescript',
			      'text/x-swift', 'text/x-rustsrc', 'text/x-php', 'text/x-go'];


export default function MonacoControlPanel(props) {
    const classes = useStyles();
    return (
	<>
	    <FormControl id = { ID() } variant="outlined" className={classes.formControl}>
		<Select
		    labelId="mate-monaco-select-moded-label"
		    id= {ID()}
		    onChange = { props.handleChange }
		    value={ props.settings.mode }
		    style= {{ backgroundColor: "white" }}
		    label="mate-monaco-mode"
		    input={ <BootstrapInput id = {ID() } /> }
		    name = {"mode"} 
		>
		    { MATE_MONACO_LANGUAGE.map(x => { return <MenuItem id = { ID() } value = {x}> {x} </MenuItem>; }) }
		</Select>
	    </FormControl>
	    <FormControl id = { ID() } variant="outlined" className={classes.formControl}>
		<Select
		    labelId="mate-monaco-select-theme-label-id"
		    id= {ID()}
		    onChange = {props.handleChange}
		    value={ props.settings.theme }
		    style= {{backgroundColor: "white"}}
		    label="mate-monaco-theme"
		    name = {"theme"} 
		    input={<BootstrapInput id = {ID()} />}
		>
		    { MATE_MONACO_THEME.map(x => { return <MenuItem id = { ID() } value = {x}> {x} </MenuItem>; }) }

		</Select>
	    </FormControl>
	    
	</>
    );
    
}
