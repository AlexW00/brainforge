import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { CardReviewAnswer } from "../../../core/data/models/flashcards/card/CardReviewData";
import { CustomElement } from "../atomic/CustomElement";

@customElement("review-action-bar")
export default class ReviewActionBar extends CustomElement {
	private handleReview = (answer: CardReviewAnswer) => {
		const event = new CustomEvent("review", {
			detail: answer,
		});
		this.dispatchEvent(event);
	};

	render() {
		return html`
			<sl-button
				id="again"
				@click=${() => this.handleReview(CardReviewAnswer.Again)}
			>
				❌ Again
			</sl-button>
			<sl-button
				id="good"
				@click=${() => this.handleReview(CardReviewAnswer.Good)}
			>
				✅ Good
			</sl-button>
			<sl-button
				id="easy"
				@click=${() => this.handleReview(CardReviewAnswer.Easy)}
			>
				🌟 Easy
			</sl-button>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 3rem;
		}
		:host([inactive]) {
			opacity: 0.5;
			pointer-events: none;
		}
	`;
}
