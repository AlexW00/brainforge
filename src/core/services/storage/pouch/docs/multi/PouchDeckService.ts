import { inject, singleton } from "@launchtray/tsyringe-async";
import { Deck } from "../../../../../data/models/flashcards/Deck";
import { DbService } from "../../DbService";
import { PouchMultiDocService } from "./PouchMultiDocService";

@singleton()
export class PouchDeckService extends PouchMultiDocService<Deck> {
	protected prefix = "deck";

	constructor(@inject(DbService) protected readonly dbService: DbService) {
		super();
	}

	async getCardIds(deckId: string) {
		const deck = await this.get(deckId);
		if (deck === undefined) throw new Error(`Deck with id ${deckId} not found`);

		return deck.cardsIds;
	}

	/**
	 * Adds a card to a deck
	 * @param deckId The ID of the deck to add the card to
	 * @param cardId The ID of the card to add
	 */
	async addCard(deckId: string, cardId: string) {
		const deck = await this.get(deckId);
		if (deck === undefined) throw new Error(`Deck with id ${deckId} not found`);

		deck.cardsIds.push(cardId);
		this.set(deck);
	}

	/**
	 * Removes a card from a deck
	 * @param deckId The ID of the deck to remove the card from
	 * @param cardId The ID of the card to remove
	 */
	async removeCard(deckId: string, cardId: string) {
		const deck = await this.get(deckId);
		if (deck === undefined) throw new Error(`Deck with id ${deckId} not found`);

		deck.cardsIds = deck.cardsIds.filter((id) => id !== cardId);
		this.set(deck);
	}

	/**
	 * Moves a card to a deck
	 * @param cardId The ID of the card to move
	 * @param oldDeckId The ID of the deck the card is in
	 * @param newDeckId The ID of the deck to move the card to
	 */
	async moveCardToDeck(cardId: string, oldDeckId: string, newDeckId: string) {
		const oldDeck = await this.get(oldDeckId);
		if (oldDeck === undefined)
			throw new Error(`Deck with id ${oldDeckId} not found`);

		const newDeck = await this.get(newDeckId);
		if (newDeck === undefined)
			throw new Error(`Deck with id ${newDeckId} not found`);

		oldDeck.cardsIds = oldDeck.cardsIds.filter((id) => id !== cardId);
		newDeck.cardsIds.push(cardId);

		await this.set(oldDeck);
		await this.set(newDeck);
	}
}
