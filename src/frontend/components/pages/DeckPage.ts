import { Task } from "@lit/task";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { container } from "tsyringe";
import type { Deck } from "../../../core/data/models/flashcards/Deck";
import { ModalService } from "../../../core/services/app/ModalService";
import { RouterService } from "../../../core/services/app/RouterService";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { CardCreatorProps } from "../modals/CardCreatorModal";

@customElement("deck-page")
export default class DeckPage extends CustomElement {
	private readonly deckService = container.resolve(PouchDeckService);
	private readonly modalService = container.resolve(ModalService);

	@property({ type: Object })
	properties!: DeckPageProperties;

	@state()
	deck?: Deck;

	private getDeckTask = new Task(
		this,
		async ([deckId]) => {
			console.log("Getting deck", deckId);
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
		console.log("Deck Card IDs", ids);
		return ids;
	}

	private handleClickCard = (e: CustomEvent<string>) => {
		const cardId = e.detail;
		this.modalService.openModal("card-viewer", { cardId });
	};

	render() {
		return html`
			<flashcard-grid
				.cardIds=${this.getCardIds()}
				@click-card=${this.handleClickCard}
			></flashcard-grid>
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

const DECK_PAGE_DEFINITION_METADATA: Metadata = {
	id: "deck-page",
	name: "Deck",
	description: "A page that displays a deck",
};

export class DeckPageDefinition extends PageDefinition<DeckPageProperties> {
	id = DECK_PAGE_DEFINITION_METADATA.id;
	name = DECK_PAGE_DEFINITION_METADATA.name;
	defaultInfo: "Deck";

	private deckPage: DeckPage;
	private readonly modalService = container.resolve(ModalService);
	private readonly routerService = container.resolve(RouterService);

	onLoad = (properties: DeckPageProperties, container: HTMLElement) => {
		this.deckPage = new DeckPage();
		this.deckPage.properties = properties;
		container.appendChild(this.deckPage);
		this.setInfo("Deck XY");
	};

	onUnload = () => {};
	onUpdate = (properties: DeckPageProperties) => {
		console.log("Updating deck page", properties);
		this.deckPage.properties = properties;
	};

	getActions() {
		return [
			{
				id: "due-today",
				title: "Due today",
				onClick: () => {
					this.routerService.navigateTo("review-page", {
						deckId: this.deckPage.properties.deckId,
						doReviewDueCards: true,
					});
				},
			},
			{
				id: "new-cards",
				title: "New cards",
				onClick: () => {
					this.routerService.navigateTo("review-page", {
						deckId: this.deckPage.properties.deckId,
						doReviewNewCards: true,
					});
				},
			},
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

export const DeckPageDefinitionBundle: IdentifiableConstructor<
	DeckPageDefinition,
	Metadata
> = {
	constructor: DeckPageDefinition,
	metadata: DECK_PAGE_DEFINITION_METADATA,
};
