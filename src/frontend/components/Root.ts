import { Task, TaskStatus } from "@lit/task";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { container } from "tsyringe";
import { MasterService } from "../../core/services/MasterService";
import { CustomElement } from "./atomic/CustomElement";
import { Deck } from "../../core/data/models/flashcards/Deck";

@customElement("root-component")
export default class RootComponent extends CustomElement {
	private masterService = container.resolve(MasterService);

	private initMasterServiceTask = new Task(
		this,
		async ([masterService]) => {
			await masterService.init();
			const decks = await masterService.storage.pouch.deckService.getAll();
			if (decks.length === 0) {
				const defaultDeck: Deck = {
					id: "0",
					name: "Default",
					cardsIds: [],
					childDecksIds: [],
				};
				await masterService.storage.pouch.deckService.set(defaultDeck);
				masterService.storage.zustand.session.state.setSelectedDeckIds([
					defaultDeck.id,
				]);
				masterService.storage.zustand.session.state.pushNavigationStep({
					pageId: "deck-page",
					properties: {
						deckId: defaultDeck.id,
					},
				});
			}
		},
		() => [this.masterService]
	);

	render() {
		return html`
			${choose(this.initMasterServiceTask.status, [
				[TaskStatus.PENDING, () => html`<load-root></load-root>`],
				[
					TaskStatus.ERROR,
					() =>
						html`<load-root
							error=${JSON.stringify(this.initMasterServiceTask.error)}
						></load-root>`,
				],
				[TaskStatus.COMPLETE, () => html`<app-root></app-root>`],
			])}
		`;
	}
}
