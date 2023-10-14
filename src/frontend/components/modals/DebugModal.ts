import { customElement } from "lit/decorators.js";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { css, html } from "lit";
import { PouchDebugService } from "../../../core/services/storage/pouch/docs/PouchDebugService";
import { container } from "tsyringe";
import { Metadata } from "../../../core/types/general/Metadata";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";

@customElement("debug-modal")
export default class DebugModal extends CustomElement {
	private readonly debug = container.resolve(PouchDebugService);

	resetDB = () => {
		this.debug.clearDb().then(() => {
			console.log("DB cleared");
		});
	};

	addRandomTopLevelDeck = () => {
		this.debug.addTopLevelDeck().then(() => {
			console.log("Added random top level deck");
		});
	};

	addRandomChildDeck = () => {
		this.debug.addChildDeck().then(() => {
			console.log("Added random child deck");
		});
	};

	addTemplateWithNodes = () => {
		this.debug.addTemplateWithNodes().then(() => {
			console.log("Added template with nodes");
		});
	};

	addRandomCardToRandomDeck = () => {
		this.debug.addRandomCardToRandomDeck().then(() => {
			console.log("Added random card to random deck");
		});
	};

	render() {
		return html`
			<div>Debug</div>
			<button @click=${this.resetDB}>Reset DB</button>
			<button @click=${this.addRandomTopLevelDeck}>
				Add random top level deck
			</button>
			<button @click=${this.addTemplateWithNodes}>
				Add template with nodes
			</button>

			<button @click=${this.addRandomChildDeck}>Add random child deck</button>
			<button @click=${this.addRandomCardToRandomDeck}>
				Add random card to random deck
			</button>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex: 1;
		}
	`;
}

export type DebugModalProperties = {
	initialCategoryId?: string;
};

export const DEBUG_MODAL_DEFINITION_METADATA: Metadata = {
	id: "debug",
	name: "Debug",
	description: "A modal that allows to debug the application",
};

export class DebugModalDefinition extends ModalDefinition<DebugModalProperties> {
	id = DEBUG_MODAL_DEFINITION_METADATA.id;
	name = DEBUG_MODAL_DEFINITION_METADATA.name;
	description = DEBUG_MODAL_DEFINITION_METADATA.description;

	public onLoad = (
		_properties: DebugModalProperties,
		container: HTMLElement
	) => {
		const settingsModal = new DebugModal();
		container.appendChild(settingsModal);
	};
}

export const DebugModalDefinitionBundle: IdentifiableConstructor<
	ModalDefinition<DebugModalProperties>,
	Metadata
> = {
	constructor: DebugModalDefinition,
	metadata: DEBUG_MODAL_DEFINITION_METADATA,
};
