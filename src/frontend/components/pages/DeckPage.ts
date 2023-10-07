import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { css, html } from "lit";
import { Deck } from "../../../core/data/models/flashcards/Deck";
import { container } from "tsyringe";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService";
import { Task } from "@lit-labs/task";

@customElement("deck-page")
export default class DeckPage extends CustomElement {
	private readonly deckService = container.resolve(PouchDeckService);

	@property({ type: Object })
	properties!: DeckPageProperties;

	deck?: Deck;

	private getDeckTask = new Task(
		this,
		async ([deckId]) => {
			const deck = await this.deckService.get(deckId);
			if (deck === undefined) throw new Error("Deck not found");
			this.deck = deck;
		},
		() => [this.properties.deckId]
	);

	render() {
		return html` <div id="title">${this.deck?.name}</div> `;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			background: var(--bg-color);
			flex: 1;
		}
	`;
}

type DeckPageProperties = {
	deckId: string;
};

export class DeckPageDefinition extends PageDefinition<DeckPageProperties> {
	id = "deck-page";
	name = "Deck";
	defaultInfo = "Deck";

	private deckPage: DeckPage;

	onLoad = (properties: DeckPageProperties, container: HTMLElement) => {
		this.deckPage = new DeckPage();
		this.deckPage.properties = properties;
		container.appendChild(this.deckPage);
		this.setInfo("Deck XY");
	};

	onUnload = () => {};
	onUpdate = (properties: DeckPageProperties) => {
		this.deckPage.properties = properties;
	};

	getActions() {
		return [
			{
				id: "add-card",
				title: "Add card",
				onClick: () => {},
			},
		];
	}
}
