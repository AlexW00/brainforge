import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";

@customElement("spacer-component")
export default class SpacerComponent extends CustomElement {
	static styles = css`
		:host {
			flex-grow: 1;
		}
	`;

	render() {
		return html``;
	}
}
