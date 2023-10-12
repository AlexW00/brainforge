import { customElement, property, state } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { css, html } from "lit";
import type { Deck } from "../../../core/data/models/flashcards/Deck";
import { container } from "tsyringe";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService";
import { Task } from "@lit-labs/task";
import { produce } from "immer";
import { ModalService } from "../../../core/services/app/ModalService";
import { CardCreatorProps } from "../modals/CardCreatorModal";

@customElement("deck-page")
export default class DeckPage extends CustomElement {
	private readonly deckService = container.resolve(PouchDeckService);

	@property({ type: Object })
	properties!: DeckPageProperties;

	@state()
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

	onDeckChanged = (e: CustomEvent<Deck>) => {
		if (e.detail.id !== this.properties.deckId) return;
		this.deck = e.detail;
		this.requestUpdate();
	};

	connectedCallback() {
		this.getDeckTask.run();
		this.deckService.on("change", this.onDeckChanged);

		super.connectedCallback();
	}

	disconnectedCallback() {
		this.deckService.off("change", this.onDeckChanged);
		super.disconnectedCallback();
	}

	private getCardIds() {
		const ids = this.deck?.cardsIds || [];
		return ids;
	}

	render() {
		return html`
			<flashcard-grid .cardIds=${this.getCardIds()}></flashcard-grid>
		`;
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
	private readonly modalService = container.resolve(ModalService);

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
				onClick: () => {
					const cardCreatorProps: CardCreatorProps = {
						deckId: this.deckPage.properties.deckId,
						templateId: this.deckPage.deck?.defaultTemplateId,
					};
					this.modalService.openModal("card-creator", cardCreatorProps);
				},
			},
		];
	}
}
