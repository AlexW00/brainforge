import { customElement } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { css, html } from "lit";

@customElement("card-editor-header")
export default class CardEditorHeader extends CustomElement {
	handleCancel = () => {
		this.dispatchEvent(new CustomEvent("cancel"));
	};

	handleSave = () => {
		this.dispatchEvent(new CustomEvent("save"));
	};

	render() {
		return html`
			<sl-button variant="default" size="small" @click=${this.handleCancel}>
				Cancel
			</sl-button>
			<slot name="center-action"></slot>
			<sl-button variant="primary" size="small" @click=${this.handleSave}>
				Save
			</sl-button>
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
