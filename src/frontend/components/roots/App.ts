import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { container } from "tsyringe";
import { PouchDebugService } from "../../../core/services/storage/pouch/docs/PouchDebugService";
import { RouterService } from "../../../core/services/app/RouterService";

@customElement("app-root")
export default class AppRoot extends CustomElement {
	constructor() {
		super();
		this.classList.add("container");
	}

	render() {
		return html`
			<app-ribbon></app-ribbon>
			<sl-split-panel position="25">
				<deck-tree-panel slot="start"></deck-tree-panel>
				<page-panel slot="end"></page-panel>
			</sl-split-panel>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: row !important;
		}
		sl-split-panel {
			flex: 1;
			--min: 15rem;
			--max: 35rem;
			--divider-width: 2px;
			/* --divider-width: 1px; */
		}
		sl-split-panel::part(divider) {
			/* background-color: black; */
		}
	`;
}
