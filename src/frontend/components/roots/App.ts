import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";

@customElement("app-root")
export default class AppRoot extends CustomElement {
	constructor() {
		super();
		this.classList.add("container");
	}

	render() {
		return html`
			<app-ribbon></app-ribbon>
			<deck-tree-panel></deck-tree-panel>
			<page-panel></page-panel>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: row !important;
		}
	`;
}
