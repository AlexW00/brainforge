import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";

@customElement("flashcard-grid")
export default class FlashcardGrid extends CustomElement {
	@property({ type: Array })
	cardIds: string[] = [];

	constructor() {
		super();
		this.classList.add("container");
	}

	render() {
		return html`
			<div id="card-grid">
				${this.cardIds.map(
					(cardId) =>
						html`<flashcard-thumbnail
							key=${cardId}
							cardId=${cardId}
							@click=${() =>
								this.dispatchEvent(
									new CustomEvent("click-card", { detail: cardId })
								)}
						></flashcard-thumbnail>`
				)}
			</div>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex: 1;
		}
		#card-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
			grid-gap: 1rem;
			padding: 1rem;
		}
	`;
}
