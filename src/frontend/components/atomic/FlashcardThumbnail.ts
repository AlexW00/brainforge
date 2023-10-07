import { customElement, property, state } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";
import type { Card } from "../../../core/data/models/flashcards/card/Card";
import { Task } from "@lit-labs/task";
import { container } from "tsyringe";
import { PouchCardService } from "../../../core/services/storage/pouch/docs/multi/PouchCardService";
import { css, html } from "lit";
import { CardRenderService } from "../../../core/services/app/CardRenderService";
import { ifDefined } from "lit/directives/if-defined.js";
import { when } from "lit/directives/when.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("flashcard-thumbnail")
export default class FlashcardThumbnail extends CustomElement {
	private readonly cardService = container.resolve(PouchCardService);
	private readonly cardRendererServicew = container.resolve(CardRenderService);

	@property({ type: String })
	cardId: string;

	@state()
	private card?: Card;

	@state()
	private cardHtml?: string;

	loadCardTask = new Task(this, {
		task: async () => {
			this.card = await this.cardService.get(this.cardId);
		},
		autoRun: false,
	});

	renderCardTask = new Task(this, {
		task: async () => {
			if (this.card === undefined) return;
			console.log("Rendering card", this.card);
			this.cardHtml = await this.cardRendererServicew.renderCard(this.card.id);
			console.log("Rendered card", this.cardHtml);
		},
		autoRun: false,
	});

	onCardIdChanged() {
		if (this.cardId === undefined) return;
		this.loadCardTask
			.run()
			.then(() => this.renderCardTask.run())
			.catch((e) => console.error(e));
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
			<sl-card>
				${when(this.cardHtml !== undefined, () =>
					unsafeHTML(`<div class="card-content">${this.cardHtml}</div>`)
				)}
			</sl-card>
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
		sl-card {
			width: 100%;
			height: 100%;
		}
	`;
}
