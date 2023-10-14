import { customElement } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { css, html } from "lit";

@customElement("card-editor-header")
export default class CardEditorHeader extends CustomElement {
	render() {
		return html`
			<sl-button variant="default" size="small"> Cancel </sl-button>
			<slot name="center-action"></slot>
			<sl-button variant="primary" size="small"> Save </sl-button>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 5rem;
		}
	`;
}
