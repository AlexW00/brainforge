import { DateString, newDateString } from "../../../../types/general/DateString";

export interface CardReviewData {
	reviews: CardReviewResult[];
	dueOn: DateString;
}

export interface CardReviewResult {
	answer: CardReviewAnswer;
	date: DateString;
}

export enum CardReviewAnswer {
	Again = "again",
	Good = "good",
	Easy = "easy",
}

export const newCardReviewData = (): CardReviewData => ({
	reviews: [],
	dueOn: newDateString(),
});
