import { customElement, property, state } from "lit/decorators.js";
import { CustomElement } from "./CustomElement.js";
import { css, html } from "lit";
import { UiEventBus } from "../../../core/services/events/UiEventBus.js";
import { container } from "tsyringe";
import type { Deck } from "../../../core/data/models/flashcards/Deck.js";
import { map } from "lit/directives/map.js";
import { Task, TaskStatus } from "@lit-labs/task";
import { PouchDeckService } from "../../../core/services/storage/pouch/docs/multi/PouchDeckService.js";
import { ViewStatus } from "../../../core/types/views/ViewState.js";
import { choose } from "lit/directives/choose.js";
import { when } from "lit/directives/when.js";
import { PersistedZustandService } from "../../../core/services/storage/zustand/PersistedZustandService.js";
import { SessionZustandService } from "../../../core/services/storage/zustand/SessionZustandService.js";

@customElement("deck-item")
export default class DeckItem extends CustomElement {
	private uiEventBus = container.resolve(UiEventBus);
	private deckService = container.resolve(PouchDeckService);

	private persistedZustand = container.resolve(PersistedZustandService);
	private sessionZustand = container.resolve(SessionZustandService);

	@property()
	deckId: string;

	@state()
	private deck?: Deck;

	@state()
	private isExpanded = false;

	private loadDeckTask = new Task(
		this,
		async ([deckId]) => {
			const deck = await this.deckService.get(deckId);
			if (deck === undefined) throw new Error("Deck not found");
			this.deck = deck;
		},
		() => [this.deckId]
	);

	private loadDecks = () => {
		this.setStatus(ViewStatus.PENDING);
		this.loadDeckTask
			.run()
			.then(() => this.setStatus(ViewStatus.COMPLETE))
			.catch(() => this.setStatus(ViewStatus.ERROR));
	};

	private initDeckExpansion = () => {
		this.isExpanded = this.persistedZustand.state.expandedDeckIds.includes(
			this.deckId
		);
		this.persistedZustand.on("expandedDeckIdsChanged", (e) => {
			const newExpandedDeckIds = e.detail;
			this.isExpanded = newExpandedDeckIds.includes(this.deckId);
		});
	};

	private initLastSelectedDeck = () => {
		this.sessionZustand.on("lastSelectedDeckIdChanged", (e) => {
			const newLastSelectedDeckId = e.detail;
			const isLastSelectedDeck = newLastSelectedDeckId === this.deckId;

			if (isLastSelectedDeck) {
				this.classList.add("last-selected");
				this.classList.add("selected");
			} else {
				this.classList.remove("last-selected");
				this.classList.remove("selected");
			}
		});
	};

	firstUpdated() {
		super.connectedCallback();
		this.initDeckExpansion();
		this.initLastSelectedDeck();

		this.loadDecks();
	}

	onclick = (e: MouseEvent) => {
		if (this.deck === undefined) return;

		this.sessionZustand.state.setLastSelectedDeckId(this.deck.id);

		this.uiEventBus.emit("deck-item-clicked", {
			deckId: this.deck.id,
		});
		e.stopPropagation();
	};

	private hasChildren() {
		return this.deck?.childDecksIds.length ?? 0 > 0;
	}

	private onExpanderClick = () => {
		if (this.deck === undefined) return;
		this.isExpanded = !this.isExpanded;
		this.persistedZustand.state.toggleExpandedDeckId(this.deck.id);
	};

	private getExpandIcon() {
		return this.isExpanded
			? html`<ph-caret-down></ph-caret-down>`
			: html` <ph-caret-right></ph-caret-right>`;
	}

	render() {
		return html`
			<div id="item">
				${when(
					this.hasChildren(),
					() => html`
						<div
							class="pre-name expander"
							@click=${() => this.onExpanderClick()}
						>
							<div class="icon">${this.getExpandIcon()}</div>
						</div>
					`,
					() => html`<div class="pre-name"></div>`
				)}
				${choose(this.loadDeckTask.status, [
					[TaskStatus.PENDING, () => html`<div>Loading...</div>`],
					[
						TaskStatus.ERROR,
						() => html`<div>Error: ${this.loadDeckTask.error}</div>`,
					],
					[
						TaskStatus.COMPLETE,
						() => html`<div id="name">${this.deck?.name ?? ""}</div>`,
					],
				])}
			</div>
			${when(
				this.hasChildren() && this.isExpanded,
				() => html`<div id="children">
					${map(
						this.deck?.childDecksIds ?? [],
						(deckId) => html` <deck-item deckId=${deckId}></deck-item> `
					)}
				</div>`
			)}
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex: 1;
			align-self: stretch;
		}

		.pre-name {
			width: var(--deck-tree-item-pre-name-width);
			padding-right: var(--deck-tree-item-pre-name-padding-right);
			user-select: none;
		}

		.expander {
			cursor: pointer;
			overflow: hidden;
			border-radius: var(--border-radius-normal);
		}

		#item {
			display: flex;
			flex-direction: row;
			align-self: stretch;

			align-items: center;

			cursor: pointer;
			flex: 1;
		}

		#name {
			display: flex;
			flex-direction: row;

			font-size: 1rem;
			align-self: stretch;
			width: 100%;

			overflow: hidden;
			border-radius: var(--border-radius-normal);
			padding: var(--deck-tree-item-padding);
		}

		#name:hover {
			-webkit-box-shadow: inset 0px 0px 0px var(--border-width-small)
				var(--bg-accent-color);
			-moz-box-shadow: inset 0px 0px 0px var(--border-width-small)
				var(--bg-accent-color);
			box-shadow: inset 0px 0px 0px var(--border-width-small)
				var(--bg-accent-color);
		}

		:host(.last-selected) #name {
			background-color: var(--bg-accent-color);
			color: var(--fg-accent-color);
		}

		#children {
			display: flex;
			flex-direction: column;
			margin-left: var(--deck-tree-item-pre-name-width);
		}
	`;
}
