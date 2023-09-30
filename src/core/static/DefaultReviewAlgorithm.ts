import { Card } from "../data/models/flashcards/card/Card";
import { CardReviewAnswer } from "../data/models/flashcards/card/CardReviewData";
import { ReviewAlgorithm } from "../types/ReviewAlgorithm";

export class DefaultReviewAlgorithm extends ReviewAlgorithm {
	calculateNextDueDate(card: Card, answer: CardReviewAnswer): Date {
		if (answer === CardReviewAnswer.Again) return this.onAgain(card);
		if (answer === CardReviewAnswer.Hard) return this.onHard(card);
		if (answer === CardReviewAnswer.Good) return this.onGood(card);
		return this.onEasy(card);
	}

	onAgain(_card: Card): Date {
		return new Date(); // Review immediately
	}

	onHard(_card: Card): Date {
		return this.addDays(new Date(), 1); // Review in 1 day
	}

	onGood(_card: Card): Date {
		return this.addDays(new Date(), 3); // Review in 3 days
	}

	onEasy(_card: Card): Date {
		return this.addDays(new Date(), 7); // Review in 7 days
	}

	// Helper function to add days to a date
	private addDays(date: Date, days: number): Date {
		date.setDate(date.getDate() + days);
		return date;
	}
}
