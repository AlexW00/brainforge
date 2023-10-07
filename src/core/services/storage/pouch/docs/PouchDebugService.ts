import { inject, singleton } from "tsyringe";
import { PouchService } from "../PouchService";
import { faker } from "@faker-js/faker";
import { Deck } from "../../../../data/models/flashcards/Deck";
import { PouchTemplateService } from "./multi/PouchTemplateService";
import { TemplateNode } from "../../../../data/models/flashcards/template/graph/TemplateNode";
import { Template } from "../../../../data/models/flashcards/template/Template";
import { Card, CardStatus } from "../../../../data/models/flashcards/card/Card";

@singleton()
export class PouchDebugService {
	constructor(
		@inject(PouchService) private readonly pouchService: PouchService,
		@inject(PouchTemplateService)
		private readonly templateService: PouchTemplateService
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

	private createFakeNode(): TemplateNode {
		return {
			id: faker.string.uuid(),
			type: "custom",
			data: {
				definitionId: "test-node",
				io: {
					inputs: {},
					outputs: {},
				},
				doReRunOnRender: true,
				data: {},
			},
			position: {
				x: faker.number.float({
					min: 0,
					max: 1000,
				}),
				y: faker.number.float({
					min: 0,
					max: 1000,
				}),
			},
		};
	}

	private getRandomTemplateId = async () => {
		const templates = await this.templateService.getAll();
		return templates[faker.number.int(templates.length - 1)].id;
	};

	private createFakeCard(templateId: string): Card {
		return {
			id: faker.string.uuid(),
			templateId,
			status: CardStatus.New,
			reviewData: {
				reviews: [],
				dueOn: new Date(),
			},
			metadata: {
				creationTimestamp: new Date(),
			},
			inputData: {},
		};
	}

	async createRandomCard() {
		const templateId = await this.getRandomTemplateId();
		const card = this.createFakeCard(templateId);

		await this.pouchService.cardService.set(card);
		return card;
	}

	async addRandomCardToRandomDeck() {
		const deckId = await this.getRandomDeckId();
		const deck = await this.pouchService.deckService.get(deckId);

		if (deck === undefined) throw new Error(`Deck with id ${deckId} not found`);

		const card = await this.createRandomCard();
		deck.cardsIds.push(card.id);
		await this.pouchService.deckService.set(deck);
	}

	async addTemplateWithNodes() {
		const nodes: TemplateNode[] = [];

		for (let i = 0; i < 10; i++) {
			nodes.push(this.createFakeNode());
		}

		const template: Template = {
			id: faker.string.uuid(),
			name: faker.lorem.words(2),
			graph: {
				nodes,
				edges: [],
			},
			viewport: {
				x: 0,
				y: 0,
				zoom: 1,
			},
		};

		await this.templateService.set(template);
	}
}
