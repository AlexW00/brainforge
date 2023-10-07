export const getUniqueKeyForObject = (
	obj: any,
	prefix: string,
	increment: number = 0
): string => {
	const keys = Object.keys(obj);

	const key = prefix + (increment === 0 ? "" : "-" + increment);

	if (keys.includes(key)) {
		return getUniqueKeyForObject(obj, prefix, increment + 1);
	}
	return key;
};
