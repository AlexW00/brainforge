import { customElement, state } from "lit/decorators.js";
import { TemplateResult, css, html } from "lit";
import Panel from "./Panel";
import { Deck, NestedDeck } from "../../../core/data/models/flashcards/Deck";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService";
import { container } from "tsyringe";
import { produce } from "immer";
import { Task } from "@lit-labs/task";
import { map } from "lit/directives/map.js";
import { RouterService } from "../../../core/services/app/RouterService";
import { SessionZustandService } from "../../../core/services/storage/zustand/SessionZustandService";
import { SlTreeItem } from "@shoelace-style/shoelace";

@customElement("deck-tree-panel")
export default class DeckTreePanel extends Panel {
	private readonly sessionZustand = container.resolve(SessionZustandService);
	private readonly router = container.resolve(RouterService);
	private readonly deckService = container.resolve(PouchDeckService);

	@state()
	private decks: NestedDeck[] = [];

	@state()
	private selectedDeckIds: string[] = [];

	@state()
	private lastSelectedDeckId?: string;

	private unregisterDeckChangeListener: (() => void) | undefined;

	private onDeckChanged = async (id: string, newValue?: Deck) => {
		if (newValue === undefined) {
			this.decks = this.decks.filter((d) => d.id !== id);
			return;
		}
		this.loadRootDecksTask.run();
	};

	private sortDecksByName = (decks: NestedDeck[]) => {
		return decks.sort((a, b) => a.name.localeCompare(b.name));
	};

	private createNestedDeck = (deck: Deck, otherDecks: Deck[]): NestedDeck => {
		const childDecks = otherDecks.filter((d) =>
			deck.childDecksIds.includes(d.id)
		);
		const nestedChildDecks = this.sortDecksByName(
			childDecks.map((d) => this.createNestedDeck(d, otherDecks))
		);
		return {
			...deck,
			childDecks: nestedChildDecks,
		};
	};

	private loadRootDecksTask = new Task(this, {
		task: async () => {
			const decks = await this.deckService.getAll();
			const rootDecks = decks.filter((deck) =>
				decks.every((d) => !d.childDecksIds.includes(deck.id))
			);
			const nestedDecks = rootDecks.map((d) => this.createNestedDeck(d, decks));
			this.sortDecksByName(nestedDecks);
			this.decks = produce(this.decks, (draft) => {
				draft.splice(0, draft.length, ...nestedDecks);
			});
		},
		autoRun: false,
	});

	connectedCallback() {
		super.connectedCallback();
		this.loadRootDecksTask.run();

		this.unregisterDeckChangeListener = this.deckService.addChangeListener(
			this.onDeckChanged
		);

		this.sessionZustand.addEventListener(
			"selectedDeckIdsChanged",
			this.onSelectedDeckIdsChanged
		);

		this.onSelectedDeckIdsChanged();
	}

	disconnectedCallback() {
		this.unregisterDeckChangeListener?.();
		this.sessionZustand.removeEventListener(
			"selectedDeckIdsChanged",
			this.onSelectedDeckIdsChanged
		);
	}

	private updateLastSelectedDeckId = () => {
		let newLastSelectedDeck;
		if (this.selectedDeckIds.length === 0) {
			newLastSelectedDeck = undefined;
		} else
			newLastSelectedDeck =
				this.selectedDeckIds[this.selectedDeckIds.length - 1];

		if (newLastSelectedDeck === this.lastSelectedDeckId) return;
		if (newLastSelectedDeck === undefined) return;

		this.lastSelectedDeckId = newLastSelectedDeck;
		this.router.navigateTo("deck-page", {
			deckId: this.lastSelectedDeckId,
		});
	};

	private onSelectedDeckIdsChanged = () => {
		this.selectedDeckIds = this.sessionZustand.state.selectedDeckIds;
		this.updateLastSelectedDeckId();
	};

	private onTreeSelectionChange = (
		e: CustomEvent<{ selection: SlTreeItem[] }>
	) => {
		const selectedDeckIds = e.detail.selection.map((item) => item.id);
		this.sessionZustand.state.setSelectedDeckIds(selectedDeckIds);
	};

	renderNestedDeck = (deck: NestedDeck): TemplateResult => {
		return html`<sl-tree-item
			?open=${true}
			?selected=${false}
			?has-children=${deck.childDecks.length > 0}
			id=${deck.id}
			>${deck.name} ${deck.childDecks.map((d) => this.renderNestedDeck(d))}
		</sl-tree-item>`;
	};

	render() {
		return html`<div id="title" class="no-select">Decks</div>
			<sl-tree @sl-selection-change=${this.onTreeSelectionChange}>
				${map(this.decks, (deck) => this.renderNestedDeck(deck))}
			</sl-tree> `;
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
			font-size: var(--sl-font-size-x-large);
			font-weight: bold;
			padding: var(--sl-spacing-medium);
			text-align: center;
		}

		sl-tree {
			padding-right: var(--sl-spacing-medium);
		}

		sl-tree-item::part(item--selected) {
			border-top-right-radius: var(--sl-border-radius-medium);
			border-bottom-right-radius: var(--sl-border-radius-medium);
		}

		/* sl-tree-item::part(item--selected) ::part(label) {
			border-inline-start-color: unset;
			background-color: var(--sl-color-primary-950);
			color: var(--bg-color);
			border-radius: var(--sl-border-radius-medium);
		} */
	`;
}
