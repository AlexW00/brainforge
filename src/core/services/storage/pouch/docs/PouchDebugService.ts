import { inject, singleton } from "tsyringe";
import { PouchService } from "../PouchService";
import { faker } from "@faker-js/faker";
import { Deck } from "../../../../data/models/flashcards/Deck";

@singleton()
export class PouchDebugService {
	constructor(
		@inject(PouchService) private readonly pouchService: PouchService
	) {}

	private newFakeDeck(): Deck {
		return {
			id: faker.string.uuid(),
			name: faker.lorem.words(2),
			cardsIds: [],
			childDecksIds: [],
		};
	}

	async clearDb() {
		await this.pouchService.clear();
	}

	async addTopLevelDeck() {
		const deck: Deck = this.newFakeDeck();

		await this.pouchService.deckService.set(deck);
	}

	async getRandomDeckId() {
		const decks = await this.pouchService.deckService.getAll();
		return decks[faker.number.int(decks.length - 1)].id;
	}

	async addChildDeck(parentDeckId?: string) {
		const parentDeck = await this.pouchService.deckService.get(
			parentDeckId ?? (await this.getRandomDeckId())
		);
		if (parentDeck === undefined)
			throw new Error(`Deck with id ${parentDeckId} not found`);

		const childDeck: Deck = this.newFakeDeck();

		await this.pouchService.deckService.set(childDeck);
		parentDeck.childDecksIds.push(childDeck.id);
		await this.pouchService.deckService.set(parentDeck);
	}
}
