


function reducer(state, action) {
    const withValidCMInstance = (cm, fn) => {
	return  (...args) => {
	    if (cm == undefined || cm == null) {
		return state;
	    }
	    else {
		return fn(...args);
	    }
	};
    };    
    
    switch (action.type) {
	case 'SAVE_MATE': {
	    let ref = action.ref.current;
	    if (ref.editor != undefined && ref.editor != null) {
		return {
		    ...state,
		    editor: {
			cursor: ref.editor.getCursor(),
		        value: ref.editor.getValue()
		    }
		};
	    }
	    else {
		return state;
	    }
	}
	case 'RESET_MATE': {
	    withValidCMInstance(action.ref.editor, () => {
		action.ref.editor.setValue(action.value);
		return {
		    ...state,
		    editor: {
			cursor: action.ref.editor.getCursor(),
			value: action.value
		    }
		}
	    })();
	}
	case 'INIT_MATE': {
	    return {
		...state,
		editor: {
		    cursor: {line: 1, ch: 1, sticky: null},
		    value: action.value
		}
	    };
	}
	default: {
	    return state;
	}
    }
};


const init = {
    editor: {
	position: {x: 0, y: 0},
	cursor: {line: 1, ch: 1, sticky: null},
	value: ""
    },
};



export { init, reducer };
