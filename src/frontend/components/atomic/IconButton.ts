import { customElement } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";
import { css, html } from "lit";

@customElement("icon-button")
export default class IconButton extends CustomElement {
	render() {
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
	`;
}
