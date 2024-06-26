import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { CustomElement } from "./CustomElement";

@customElement("flashcard-thumbnail")
export default class FlashcardThumbnail extends CustomElement {
	@property({ type: String })
	cardId: string;

	render() {
		return html`
			<sl-card>
				<flashcard-content cardId=${ifDefined(this.cardId)}></flashcard-content>
			</sl-card>
		`;
	}

	static styles = css`
		:host {
			user-select: none;
			cursor: pointer;
		}
		sl-card::part(base):hover {
			box-shadow: var(--sl-shadow-medium);
		}
		sl-card {
			width: 100%;
			height: 100%;
		}
		flashcard-content {
			overflow: hidden;
			height: 10rem;
			position: relative;
		}
		flashcard-content::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 2rem;
			background: linear-gradient(transparent, white);
		}
	`;
}
