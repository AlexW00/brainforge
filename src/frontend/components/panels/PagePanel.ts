import { customElement } from "lit/decorators.js";
import Panel from "./Panel";
import { css, html } from "lit";

@customElement("page-panel")
export default class PagePanel extends Panel {
	render() {
		return html`<div>Page</div>`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			background: var(--bg-color);

			flex: 12 1 20rem;
		}
	`;
}
