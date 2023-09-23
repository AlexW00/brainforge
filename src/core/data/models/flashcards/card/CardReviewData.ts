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
	Hard = "hard",
	Good = "good",
	Easy = "easy",
}
