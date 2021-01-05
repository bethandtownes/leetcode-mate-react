export function valueOr(x, other) {
    if (x == null || x == undefined) {
	return other;
    }
    else {
	return x;
    }
}
