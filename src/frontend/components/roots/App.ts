import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { container } from "tsyringe";
import { PouchDebugService } from "../../../core/services/storage/pouch/docs/PouchDebugService";

@customElement("app-root")
export default class AppRoot extends CustomElement {
	private pouchDebugService = container.resolve(PouchDebugService);

	constructor() {
		super();
		this.classList.add("container");
	}

	firstUpdated() {
		// this.pouchDebugService.addTopLevelDeck();
		// this.pouchDebugService.addTopLevelDeck();
		// this.pouchDebugService.addTopLevelDeck();
		// this.pouchDebugService.addTopLevelDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
		// this.pouchDebugService.addChildDeck();
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
