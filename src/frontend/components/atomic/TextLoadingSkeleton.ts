import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { CustomElement } from "./CustomElement";

@customElement("text-loading-skeleton")
export default class TextLoadingSkeleton extends CustomElement {
	@property({ type: Number })
	numberOfLines: number = 4;

	private getLength = () => {
		return Math.floor(Math.random() * 30) + 70;
	};

	render() {
		return html`
			${map(
				Array(this.numberOfLines).fill(0),
				(_v, i) => html`<sl-skeleton
					style="width: ${this.getLength()}%"
				></sl-skeleton>`
			)}
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
	`;
}
