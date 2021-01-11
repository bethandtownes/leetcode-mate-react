import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import * as acquire from "../../../lib/acquire.js";




export default function EditorSettings() {
    const [state, setState] = React.useState(null);
    const [loaded, setLoaded] = React.useState(false);

    
    React.useEffect(async () => {
	if (!loaded) {
	    const storagedSettings = await acquire.LeetCodeEditorSettings();
	    setState(storagedSettings);
	    setLoaded(true);
	}
	return;
    }, []);


    const handleChange = async (event) => {
	const newState = {...state, [event.target.name]: event.target.checked };
	setState(newState);
	chrome.storage.local.set({
	    leetcodeEditorSettings: JSON.stringify(newState),
	}, function() {
	    console.log('stored new settings');
	});
	window.dispatchEvent(new CustomEvent("EDITOR_CONFIG_EVENT", { detail : { action: "UPDATE", data: newState } }));
    };


    return (
	loaded && <FormControl component="fieldset">
	    <FormLabel component="legend">CodeMirror Editor Settings</FormLabel>
	    <FormGroup>
		<FormControlLabel
		    control={<Switch checked={state.bracketMatching} onChange={handleChange} name="bracketMatching" />}
		    label="Bracket Matching"
		/>
		<FormControlLabel
		    control={<Switch checked={state.blinkingCursor} onChange={handleChange} name="blinkingCursor" />}
		    label="Blinking Cursor"
		/>
	    </FormGroup>
	    {/* <FormHelperText>Be careful</FormHelperText> */}
	</FormControl>
    );
}
