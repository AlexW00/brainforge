import { customElement, state } from "lit/decorators.js";
import { css, html } from "lit";
import Panel from "./Panel";
import { Deck } from "../../../core/data/models/flashcards/Deck";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService";
import { container } from "tsyringe";
import { produce } from "immer";
import { Task } from "@lit-labs/task";

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

	private unregisterDeckChangeListener: (() => void) | undefined;

	private onDeckChanged = async (id: string, newValue?: Deck) => {
		if (newValue === undefined) {
			this.rootDecks = this.rootDecks.filter((d) => d.id !== id);
			return;
		}
		this.loadRootDecksTask.run();
	};

	private sortDecksByName = (decks: Deck[]) => {
		return decks.sort((a, b) => a.name.localeCompare(b.name));
	};

	private loadRootDecksTask = new Task(this, {
		task: async () => {
			const decks = await this.deckService.getAll();
			const rootDecks = decks.filter((deck) =>
				decks.every((d) => !d.childDecksIds.includes(deck.id))
			);
			this.rootDecks = produce(rootDecks, this.sortDecksByName);
		},
		autoRun: false,
	});

	connectedCallback() {
		super.connectedCallback();
		this.loadRootDecksTask.run();

		this.unregisterDeckChangeListener = this.deckService.addChangeListener(
			this.onDeckChanged
		);
	}

	disconnectedCallback() {
		this.unregisterDeckChangeListener?.();
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
