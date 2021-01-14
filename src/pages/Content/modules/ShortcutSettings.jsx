import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import FormHelperText from '@material-ui/core/FormHelperText';

import FormLabel from '@material-ui/core/FormLabel';

import { Typography, Box, FormControlLabel, FormGroup } from '@material-ui/core';

const BootstrapInput = withStyles((theme) => ({
    root: {
 	'label + &': {
 	    marginTop: theme.spacing(3),
 	},
    },
    input: {
	width: "35px",
 	borderRadius: 2,
 	position: 'relative',
 	backgroundColor: theme.palette.background.paper,
 	border: '1px solid #ced4da',
 	fontSize: 14,

 	padding: '10px 26px 10px 24px',
 	transition: theme.transitions.create(['border-color', 'box-shadow']),
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






const MOD_KEYS = ["Ctrl", "Alt", "Shift", "Meta"];


const ShortcutItem = (props) => {
    const classes = useStyles();
      
    return (
	<>
	    <FormControlLabel
		labelPlacement = 'start'
		control={
		    <Box>
			<FormControl className={classes.margin}>
			    <Select
				labelId="toggelsub-mod1-label"
				id = "togglesub-mod1"
				value = "Ctrl"
				input={<BootstrapInput />}
			    >
				{MOD_KEYS.map((x) => {return (<MenuItem value = {x}> {x} </MenuItem>);})}
			    </Select>
			    <FormHelperText variant = 'outlined'> Mod Key 1 </FormHelperText>
			</FormControl>
			<FormControl className={classes.margin}>
			    <Select
				labelId="togglesub-mod2-label"
				id="togglesub-mod2-label"
				value = "None"
				input={<BootstrapInput />}
			    >
				{MOD_KEYS.map((x) => {return (<MenuItem value = {x}> {x} </MenuItem>);})}
			    </Select>
			    <FormHelperText variant = 'outlined'> Mod Key 2 </FormHelperText>
			</FormControl>
			<FormControl className={classes.margin}>
			    <BootstrapInput id="demo-customized-textbox" inputProps = {{maxLength: 1, style: { padding: '10px 26px 10px 15px', width: "10px"}}}/>
			    <FormHelperText variant = 'outlined'> {"Key"} </FormHelperText>

			</FormControl>
		    </Box>

		}
		label= {<Box mb={2}> <Typography> {props.functionName} </Typography> </Box>}
	    />
	</>
    );
    
};

export default function ShortcutsSettings(props) {
    const classes = useStyles();
    const [load, setLoad] = useState(false);
    
    return (
	<>
	    <FormControl component="div">
		<FormLabel component="legend"> Shortcuts </FormLabel>
		<FormGroup>
		    <ShortcutItem functionName = "Toggle Submission Board" />
		</FormGroup>
	    </FormControl>
	</>
    );
}

