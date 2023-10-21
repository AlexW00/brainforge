import { inject, singleton } from "tsyringe";
import { Card, CardStatus } from "../../data/models/flashcards/card/Card";
import {
	CardReviewAnswer,
	CardReviewResult,
} from "../../data/models/flashcards/card/CardReviewData";
import { DefaultReviewAlgorithm } from "../../static/DefaultReviewAlgorithm";
import { ReviewAlgorithm } from "../../types/ReviewAlgorithm";
import { Observable } from "../../types/events/Observable";
import { newDateString, parseDateString } from "../../types/general/DateString";
import { PouchCardService } from "../storage/pouch/docs/multi/PouchCardService";
import { PouchDeckService } from "../storage/pouch/docs/multi/PouchDeckService";

type EventMap = {
	cardReviewed: {
		card: Card;
		answer: CardReviewAnswer;
	};
};

@singleton()
export class ReviewService extends Observable<EventMap> {
	private reviewAlgorithm: ReviewAlgorithm = new DefaultReviewAlgorithm();

	constructor(
		@inject(PouchCardService) private readonly cardService: PouchCardService,
		@inject(PouchDeckService) private readonly deckService: PouchDeckService
	) {
		super();
	}

	/**
	 * Returns the review algorithm currently in use.
	 * @returns The review algorithm currently in use.
	 */
	public getReviewAlgorithm(): ReviewAlgorithm {
		return this.reviewAlgorithm;
	}

	/**
	 * Sets the review algorithm to use.
	 * @param reviewAlgorithm The review algorithm to use.
	 */
	public setReviewAlgorithm(reviewAlgorithm: ReviewAlgorithm): void {
		this.reviewAlgorithm = reviewAlgorithm;
	}

	/**
	 * Reviews a card.
	 * @param cardId The ID of the card to review.
	 * @param answer The answer to the card.
	 */
	public async reviewCard(cardId: string, answer: CardReviewAnswer) {
		const card = await this.cardService.get(cardId);
		if (card === undefined) throw new Error(`Card with id ${cardId} not found`);

		const nextDueDate =
				card.status === CardStatus.New
					? newDateString()
					: this.reviewAlgorithm.calculateNextDueDate(card, answer),
			reviewResult: CardReviewResult = {
				answer,
				date: newDateString(),
			};

		await this.cardService.addReview(cardId, reviewResult, nextDueDate);
		this.emit("cardReviewed", {
			card,
			answer,
		});
	}

	/**
	 * Returns all cards that are due today or earlier.
	 * @param deckId ID of the deck to get the cards from
	 * @returns All cards that are due today or earlier.
	 */
	async getDueCards(deckId?: string): Promise<Card[]> {
		const today = new Date();

		// get cards from deck
		if (deckId !== undefined) {
			const cardIds = await this.deckService.getCardIds(deckId);
			const cards = await this.cardService.getMany(cardIds);
			return cards.filter(
				(card) =>
					parseDateString(card.reviewData.dueOn) <= today &&
					card.status === CardStatus.Learning
			);
		}

		// get all cards
		return await this.cardService.findAll(
			(card) =>
				parseDateString(card.reviewData.dueOn) <= today &&
				card.status === CardStatus.Learning
		);
	}

	/**
	 * Returns all cards that are new
	 * @param deckId ID of the deck to get the cards from
	 * @returns All cards that are new
	 */
	async getNewCards(deckId?: string): Promise<Card[]> {
		// get cards from deck
		if (deckId !== undefined) {
			const cardIds = await this.deckService.getCardIds(deckId);
			const cards = await this.cardService.getMany(cardIds);
			return cards.filter((card) => card.status === CardStatus.New);
		}
		// get all cards
		return await this.cardService.findAll(
			(card) => card.status === CardStatus.New
		);
	}

	/**
	 * Checks if a card is due today or earlier.
	 * @param cardId ID of the card to check
	 * @returns Whether the card is due or not
	 */
	async isDue(cardId: string): Promise<boolean> {
		const card = await this.cardService.get(cardId);
		if (card === undefined) throw new Error(`Card with id ${cardId} not found`);

		return parseDateString(card.reviewData.dueOn) <= new Date();
	}
}
