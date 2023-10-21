export type DateString = string;

export const newDateString = (): DateString => {
	return new Date().toISOString();
};

export const parseDateString = (dateString: DateString): Date => {
	return new Date(dateString);
};
