import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";

/**
 * A card component.
 */
@customElement("card-element")
export default class CardElement extends CustomElement {
	static styles = css`
		:host {
			overflow: hidden;

			width: 100%;
			height: 100%;

			border-radius: 5px;
			border: 1px solid var(--border-color);
			background: var(--bg-color);
			box-shadow: 2px 2px 0px 0px var(--shadow-color-soft);
		}

		:host(:hover) {
			transform: translate(-1px, -1px);
			box-shadow: 3px 3px 0px 0px var(--shadow-color-hard);
			z-index: 1;
		}

		::slotted(*) {
			display: block;
		}
	`;

	render() {
		return html`<slot></slot> `;
	}
}
