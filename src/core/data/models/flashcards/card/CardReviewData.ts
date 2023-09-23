export interface CardReviewData {
	reviews: CardReviewResult[];
	dueOn: Date;
}

export interface CardReviewResult {
	answer: CardReviewAnswer;
	timestamp: number;
}

export enum CardReviewAnswer {
	Again = "again",
	Hard = "hard",
	Good = "good",
	Easy = "easy",
}
