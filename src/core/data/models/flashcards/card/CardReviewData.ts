export interface CardReviewData {
	reviews: CardReviewResult[];
	dueOn: Date;
}

export interface CardReviewResult {
	answer: CardReviewAnswer;
	date: Date;
}

export enum CardReviewAnswer {
	Again = "again",
	Good = "good",
	Easy = "easy",
}

export const newCardReviewData = (): CardReviewData => ({
	reviews: [],
	dueOn: new Date(),
});
