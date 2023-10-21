export type DateString = string;

export const newDateString = (): DateString => {
	return new Date().toISOString();
};

export const toDateString = (date: Date): DateString => {
	return date.toISOString();
};

export const parseDateString = (dateString: DateString): Date => {
	return new Date(dateString);
};
