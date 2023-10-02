import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";

@customElement("dimmed-background")
export default class DimmedBackground extends CustomElement {
	render() {
		return html``;
	}

	static styles = css`
		:host {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: var(--dimmed-bg-color);
		}
	`;
}
