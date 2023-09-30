import { inject, singleton } from "tsyringe";
import {
	Card,
	CardStatus,
} from "../../../../../data/models/flashcards/card/Card";
import { CardReviewResult } from "../../../../../data/models/flashcards/card/CardReviewData";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";

@singleton()
export class PouchCardService extends PouchMultiDocService<Card> {
	protected prefix = "card";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}

	/**
	 * Adds a review to a card and updates the card's due date
	 * @param cardId ID of the card to update
	 * @param reviewResult The result of the review
	 * @param nextDueDate The next due date of the card
	 */
	async addReview(
		cardId: string,
		reviewResult: CardReviewResult,
		nextDueDate: Date
	) {
		const card = await this.get(cardId);
		if (card === undefined) throw new Error(`Card with id ${cardId} not found`);

		card.reviewData.reviews.push(reviewResult);
		card.reviewData.dueOn = nextDueDate;

		await this.set(card);
	}

	/**
	 * Returns all cards that are trashed.
	 * @returns All cards that are trashed.
	 */
	async getTrashedCards(): Promise<Card[]> {
		return this.findAll((card) => card.status === CardStatus.Trashed);
	}

	/**
	 * Returns all cards that are archived.
	 * @returns All cards that are archived.
	 */
	async getArchivedCards(): Promise<Card[]> {
		return this.findAll((card) => card.status === CardStatus.Archived);
	}
}
