import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { css, html } from "lit";

@customElement("deck-page")
export default class DeckPage extends CustomElement {
	@property({ type: Object })
	properties: DeckPageProperties;

	render() {
		return html` Deck page for deck ${this.properties.deckId} `;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			background: var(--bg-color);
			flex: 1;
		}
	`;
}

type DeckPageProperties = {
	deckId: string;
};

export class DeckPageDefinition extends PageDefinition<DeckPageProperties> {
	id = "deck-page";
	name = "Deck";

	private deckPage: DeckPage;

	getTitle() {
		return this.deckPage?.properties?.deckId ?? "No deck";
	}

	onLoad = (properties: DeckPageProperties, container: HTMLElement) => {
		this.deckPage = new DeckPage();
		this.deckPage.properties = properties;
		container.appendChild(this.deckPage);
	};
	onUnload = () => {};
	onUpdate = (properties: DeckPageProperties) => {
		this.deckPage.properties = properties;
	};

	getActions() {
		return [];
	}
}
