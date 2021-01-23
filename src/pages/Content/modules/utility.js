export function valueOr(x, other) {
    if (x == null || x == undefined) {
	return other;
    }
    else {
	return x;
    }
}

export const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};


export function withValidRef(ref, fn) {
    return (...args) => {
	if ( ref == null || ref == undefined || ref.current == null || ref.current == undefined) {
	    return;
	}
	else {
	    fn(...args);
	}
    };
	
}


export const DEBUG_MODE = true;
