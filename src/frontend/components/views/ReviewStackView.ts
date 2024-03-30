import { PropertyValueMap, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Card } from "../../../core/data/models/flashcards/card/Card";
import { CustomElement } from "../atomic/CustomElement";
import FlashcardContent from "../atomic/FlashcardContent";

@customElement("review-stack-view")
export default class ReviewStackView extends CustomElement {
	@property({ type: Array })
	cards: Card[] = [];

	private preRenderedCards: FlashcardContent[] = [];

	constructor() {
		super();
		this.classList.add("container");
	}

	private getTopCards(n: number) {
		const cards = this.cards.slice(0, n);
		return cards;
	}

	private getPreRenderedCard = (n: number) => {
		if (this.preRenderedCards[n] === undefined) {
			console.error("Card not found in pre-rendered cards");
			return html``;
		}

		return html` <sl-card> ${this.preRenderedCards[n]} </sl-card> `;
	};

	// listen to property changes
	protected updated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		if (_changedProperties.has("cards")) {
			this.preRenderedCards = this.getTopCards(3).map((card) => {
				const cardElement = new FlashcardContent();
				cardElement.cardId = card.id;
				cardElement.foldingLevel = 1;
				return cardElement;
			});
			this.requestUpdate();
			this.dispatchEvent(new CustomEvent("reviewStackUpdated"));
		}
	}

	private handleExpand = (e: CustomEvent<any>) => {
		const numFoldingsToExpand = e.detail.numFoldingsToExpand;
		const shownCard = this.preRenderedCards[0];
		if (shownCard === undefined) return;

		const currentFoldLevel = shownCard.foldingLevel;
		shownCard.foldingLevel = currentFoldLevel + numFoldingsToExpand;
	};

	render() {
		if (this.cards.length === 0) return html`<div>No cards</div>`;
		return html`<div @expand=${this.handleExpand}>
			${this.getPreRenderedCard(0)}
		</div>`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex: 1;
			align-items: center;
			justify-content: center;
		}
	`;
}
