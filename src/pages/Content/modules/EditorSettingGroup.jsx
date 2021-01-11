
import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';

chrome.storage.local.set({
    leetcodeEditorSettings: JSON.stringify({
	    bracketMatching: true,
	    blinkingCursor: true
	})
}, function() {
    console.log('default Editor setting is set');
});

/* chrome.storage.local.get(['key'], function(result) {
 *     console.log('Value currently is ' + result.key);
 * }); */


async function getValue() {
    const p = new Promise((resolve, fail) => {
	chrome.storage.local.get(['leetcodeEditorSettings'], function(result) {
	    console.log("result");
	    console.log(result);

	    resolve(JSON.parse(result.leetcodeEditorSettings));
	})
    });
    const r = await p;
    return r;
}

export default function EditorSettings() {
    const [state, setState] = React.useState({
	bracketMatching: false,
	blinkingCursor: false
    });

    
    React.useEffect(async () => {
	const localSettings = await getValue();
	setState(localSettings);
	// chrome.storage.local.set({
	//     leetcodeEditorSettings: JSON.stringify(state)
	// }, function() {
	//     console.log('Editor setting is updated and the current state is');
	//     console.log(state);
	// });
    }, []);
    
    /* 
     * React.useEffect(() => {
       
       console.log('bswtich');
       if (state.bracketMatch == false) {
       const enforceBracketMatchingOff = () => {
       let event = new CustomEvent('BRACKET_MATCH_OFF');
       window.dispatchEvent(event);
       };
       window.addEventListener('click', enforceBracketMatchingOff);
       return () => {
       window.removeEventListener('click', enforceBracketMatchingOff);
       };
       }
       else {
       let event = new CustomEvent('BRACKET_MATCH_ON');
       window.dispatchEvent(event);
       return;
       }
       
     * }, [state.bracketMatch]); */
    

    
    const handleChange = (event) => {
	/* console.log(event); */
	setState({...state, [event.target.name]: event.target.checked });
    };

    /* const handleBracketMatch = (event) => {
       if (event.target.checked) {
       let event = new CustomEvent('BRACKET_MATCH_ON');
       window.dispatchEvent(event);
       }
       else {
       let event = new CustomEvent('BRACKET_MATCH_OFF');
       window.dispatchEvent(event);
       }
       setState({ ...state, [event.target.name]: event.target.checked });
     * }; */

    return (
	<FormControl component="fieldset">
	    <FormLabel component="legend">Assign responsibility</FormLabel>
	    <FormGroup>
		<FormControlLabel
		    control={<Switch checked={state.bracketMatching} onChange={handleChange} name="bracketMatching" />}
		    label="Bracket Match"
		/>
		<FormControlLabel
		    control={<Switch checked={state.blinkingCursor} onChange={handleChange} name="blinkingCursor" />}
		    label="Blinking Cursor"
		/>
	    </FormGroup>
	    <FormHelperText>Be careful</FormHelperText>
	</FormControl>
    );
}
