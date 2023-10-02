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
	private rootDecks: Deck[] = [];

	firstUpdated() {
		super.connectedCallback();

		this.deckService.getAll().then((decks) => {
			// console.log(decks);
			this.rootDecks = decks.filter((deck) =>
				decks.every((d) => !d.childDecksIds.includes(deck.id))
			);
		});
	}

	render() {
		return html`<div id="title" class="no-select">Decks</div>
			<div id="decks">
				${this.rootDecks.map((deck) => {
					return html`<deck-item deckId=${deck.id}></deck-item>`;
				})}
			</div> `;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			background: var(--bg-color);
			flex: 1 1 25rem;
			min-width: 25rem;
			max-width: 25rem;
			border-right: var(--border-width-small) solid var(--border-color);
			border-top-left-radius: var(--border-radius-large);
			border-bottom-left-radius: var(--border-radius-large);
		}
		#title {
			font-size: 1.5rem;
			font-weight: bold;
			padding: 1rem;
			text-align: center;
		}
		#decks {
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			overflow-x: hidden;
			padding: 0.5rem;
		}
	`;
}
