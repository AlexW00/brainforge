export const arraysContainSameElements = (a: any[], b: any[]) => {
	if (a === b) {
		return true;
	}
	if (a.length !== b.length) {
		return false;
	}
	const aCopy = [...a];
	const bCopy = [...b];
	aCopy.sort();
	bCopy.sort();
	for (let i = 0; i < aCopy.length; i++) {
		if (aCopy[i] != bCopy[i]) {
			return false;
		}
	}
	return true;
};
