import { Card } from "../data/models/flashcards/card/Card";
import { CardReviewAnswer } from "../data/models/flashcards/card/CardReviewData";
import { ReviewAlgorithm } from "../types/ReviewAlgorithm";
import {
	DateString,
	newDateString,
	parseDateString,
	toDateString,
} from "../types/general/DateString";

export class DefaultReviewAlgorithm extends ReviewAlgorithm {
	calculateNextDueDate(card: Card, answer: CardReviewAnswer): DateString {
		if (answer === CardReviewAnswer.Again) return this.onAgain(card);
		if (answer === CardReviewAnswer.Good) return this.onGood(card);
		return this.onEasy(card);
	}

	onAgain(_card: Card): DateString {
		return newDateString(); // Review immediately
	}

	onGood(_card: Card): DateString {
		return this.addDays(newDateString(), 3); // Review in 3 days
	}

	onEasy(_card: Card): DateString {
		return this.addDays(newDateString(), 7); // Review in 7 days
	}

	// Helper function to add days to a date
	private addDays(date: DateString, days: number): DateString {
		const newDate = parseDateString(date);
		newDate.setDate(newDate.getDate() + days);
		return toDateString(newDate);
	}
}
