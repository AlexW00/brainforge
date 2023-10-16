import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";

@customElement("card-viewer-modal")
export default class CardViewerModal extends CustomElement {
	@property({ type: Object })
	props: CardViewerModalProperties;

	render() {
		return html`
			<sl-card>
				<flashcard-content cardId=${this.props.cardId}></flashcard-content>
			</sl-card>
		`;
	}

	static styles = css`
		:host {
			user-select: none;
			cursor: pointer;

			min-width: 30rem;

			display: flex;
			flex: 1;
			overflow-y: hidden;
		}
		sl-card {
			display: flex;
			flex: 1;
			overflow: hidden;
			width: 100%;
		}
		sl-card::part(base) {
			display: flex;
			flex: 1;
		}
		sl-card::part(body) {
			display: flex;
			flex: 1;
			overflow: hidden;
		}
		flashcard-content {
			overflow-y: auto;
			flex: 1;
		}
	`;
}

export type CardViewerModalProperties = {
	cardId: string;
	collapsed?: boolean;
};

export const FLASHCARD_MODAL_METADATA: Metadata = {
	id: "card-viewer",
	name: "Card Viewer",
	description: "Modal to view a flashcard",
};

export class CardViewerModalDefinition extends ModalDefinition<CardViewerModalProperties> {
	id = FLASHCARD_MODAL_METADATA.id;
	name = FLASHCARD_MODAL_METADATA.name;
	description = FLASHCARD_MODAL_METADATA.description;

	doShowBackground = false;
	maxWidth = "50%";
	maxHeight = "90%";

	public onLoad = (
		properties: CardViewerModalProperties,
		container: HTMLElement
	) => {
		const settingsModal = new CardViewerModal();
		settingsModal.props = properties;
		container.appendChild(settingsModal);
	};
}

export const CardViewerModalDefinitionBundle: IdentifiableConstructor<
	ModalDefinition<CardViewerModalProperties>,
	Metadata
> = {
	constructor: CardViewerModalDefinition,
	metadata: FLASHCARD_MODAL_METADATA,
};
