import { customElement, property, state } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";
import type { Card } from "../../../core/data/models/flashcards/card/Card";
import { Task } from "@lit-labs/task";
import { container } from "tsyringe";
import { PouchCardService } from "../../../core/services/storage/pouch/docs/multi/PouchCardService";
import { css, html } from "lit";

@customElement("flashcard-thumbnail")
export default class FlashcardThumbnail extends CustomElement {
	private readonly cardService = container.resolve(PouchCardService);

	@property({ type: String })
	cardId: string;

	@state()
	private card?: Card;

	loadCardTask = new Task(this, {
		task: async () => {
			this.card = await this.cardService.get(this.cardId);
		},
		autoRun: false,
	});

	onCardIdChanged() {
		if (this.cardId === undefined) return;
		this.loadCardTask.run();
	}

	onCardChanged = (e: CustomEvent<Card>) => {
		if (e.detail.id !== this.cardId) return;
		this.card = e.detail;
	};

	connectedCallback() {
		super.connectedCallback();
		this.onCardIdChanged();
		this.cardService.on("change", this.onCardChanged);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.cardService.off("change", this.onCardChanged);
	}

	render() {
		return html`
			<sl-card> ${this.card?.id}, ${this.card?.templateId} </sl-card>
		`;
	}

	static styles = css`
		:host {
			max-height: 40rem;
			user-select: none;
			cursor: pointer;
		}
		sl-card::part(base):hover {
			box-shadow: var(--sl-shadow-medium);
		}
	`;
}
