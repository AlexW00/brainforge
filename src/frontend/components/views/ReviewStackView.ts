import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { Card } from "../../../core/data/models/flashcards/card/Card";
import { CustomElement } from "../atomic/CustomElement";

@customElement("review-stack-view")
export default class ReviewStackView extends CustomElement {
	@property({ type: Array })
	cards: Card[] = [];

	onkeydown = (e: KeyboardEvent) => {
		if (e.code === "Space") {
			console.warn("TODO: Show answer");
			this.dispatchEvent(new CustomEvent("expandLimitReached"));
		}
	};

	constructor() {
		super();
		this.classList.add("container");
	}

	private getTopCards(n: number) {
		return this.cards.slice(0, n);
	}

	render() {
		if (this.cards.length === 0) return html`<div>No cards</div>`;
		return html`
			${map(
				this.getTopCards(3),
				(card, index) =>
					html`
						<sl-card class="${ifDefined(index !== 0 ? "hidden" : "active")}">
							<flashcard-content
								id="${index}"
								cardId=${card.id}
							></flashcard-content>
						</sl-card>
					`
			)}
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex: 1;
		}
	`;
}
