import { customElement, state } from "lit/decorators.js";
import { css, html } from "lit";
import Panel from "./Panel";
import { Deck } from "../../../core/data/models/flashcards/Deck";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService";
import { container } from "tsyringe";

@customElement("deck-tree-panel")
export default class DeckTreePanel extends Panel {
	constructor(
		private readonly deckService: PouchDeckService = container.resolve(
			PouchDeckService
		)
	) {
		super();
	}

	@state()
	private decks: Deck[] = [];

	firstUpdated() {
		super.connectedCallback();

		this.deckService.getAll().then((decks) => {
			this.decks = decks;
		});
	}

	render() {
		return html`<div>Decks</div>
			<ul>
				${this.decks.map((deck) => {
					return html`<li>${deck.name}</li>`;
				})}
			</ul> `;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			background: var(--bg-color);
			flex: 1 1 20rem;
			min-width: 20rem;
		}
	`;
}
