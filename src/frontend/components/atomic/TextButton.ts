import { customElement } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";
import { css, html } from "lit";

@customElement("text-button")
export default class TextButton extends CustomElement {
	render() {
		console.log("text-button");
		return html`<button><slot></slot></button>`;
	}

	static styles = css`
		button {
			background: none;
			border: none;
			padding: 0;
			font: inherit;
			cursor: pointer;
			outline: inherit;
			color: var(--text-color);
		}

		button:hover {
			text-decoration: underline;
		}
	`;
}
