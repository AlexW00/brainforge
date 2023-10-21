import { Card } from "../data/models/flashcards/card/Card";
import { CardReviewAnswer } from "../data/models/flashcards/card/CardReviewData";
import { DateString } from "./general/DateString";

export abstract class ReviewAlgorithm {
	/**
	 * Calculates the next review date for a card.
	 * @param card The card that has been reviewed.
	 * @param answer The answer that was given to the card.
	 */
	abstract calculateNextDueDate(card: Card, answer: CardReviewAnswer): DateString;
}
