import { Task, TaskStatus } from "@lit/task";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { container } from "tsyringe";
import { MasterService } from "../../core/services/MasterService";
import { CustomElement } from "./atomic/CustomElement";
import { Deck } from "../../core/data/models/flashcards/Deck";
import { DEFAULT_DECK } from "./default/defaultDeck";
import { DEFAULT_TEMPLATE } from "./default/defaultTemplate";
import { DEFAULT_CARDS } from "./default/defaultCards";
import {
	PrimaryColor,
	setPrimaryColor,
} from "../../core/types/views/PrimaryColor";

@customElement("root-component")
export default class RootComponent extends CustomElement {
	private masterService = container.resolve(MasterService);

	private initMasterServiceTask = new Task(
		this,
		async ([masterService]) => {
			await masterService.init();

			const preferences =
				await masterService.storage.pouch.preferencesService.get();
			setPrimaryColor(preferences?.primaryColor!!);

			masterService.storage.pouch.preferencesService.addChangeListener(
				async () => {
					const preferences =
						await masterService.storage.pouch.preferencesService.get();
					const primaryColor = preferences?.primaryColor;
					if (primaryColor) {
						setPrimaryColor(primaryColor);
					}
				}
			);

			const decks = await masterService.storage.pouch.deckService.getAll();
			if (decks.length === 0) {
				await masterService.storage.pouch.deckService.set(DEFAULT_DECK);
				await masterService.storage.pouch.templateService.set(DEFAULT_TEMPLATE);

				// iterate over DEFAULT_CARDS
				for (const card of DEFAULT_CARDS) {
					await masterService.storage.pouch.cardService.set(card);
				}
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
