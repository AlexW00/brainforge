import { customElement } from "lit/decorators";
import { CustomElement } from "../../../../../frontend/components/atomic/CustomElement";
import { css, html } from "lit";

@customElement("divider-component")
export default class DividerComponent extends CustomElement {
	render() {
		return html`<hr />`;
	}

	static styles = css`
		:host {
			display: block;
			height: 1px;
			background-color: var(--divider-color);
			border: none;
			margin: 0;
			padding: 0;
		}
	`;
}
