import { Task } from "@lit-labs/task";
import { html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { container } from "tsyringe";
import type { Card } from "../../../core/data/models/flashcards/card/Card";
import { CardRenderService } from "../../../core/services/app/CardRenderService";
import { PouchCardService } from "../../../core/services/storage/pouch/docs/multi/PouchCardService";
import { CustomElement } from "./CustomElement";

@customElement("flashcard-content")
export default class FlashcardContent extends CustomElement {
	private readonly cardService = container.resolve(PouchCardService);
	private readonly cardRendererServicew = container.resolve(CardRenderService);

	constructor() {
		super();
		this.classList.add("container");
	}

	@property({ type: String })
	cardId: string;

	@state()
	private card?: Card;

	@state()
	private cardHtml?: string;

	loadCardTask = new Task(this, {
		task: async () => {
			console.log("Loading card", this.cardId);
			this.card = await this.cardService.get(this.cardId);
			return this.card;
		},
		autoRun: false,
	});

	renderCardTask = new Task(this, {
		task: async () => {
			console.log("load card  status", this.loadCardTask.status);
			if (this.card === undefined) return;
			this.cardHtml = await this.cardRendererServicew.renderCard(this.card.id);
			return this.cardHtml;
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

	renderContent = () => {
		if (this.cardHtml === undefined) return "";
		return unsafeHTML(`${this.cardHtml}`);
	};

	render() {
		return html`
			<loading-wrapper .status=${this.loadCardTask.status}>
				<div class="content" slot="completed">
					<loading-wrapper status=${this.renderCardTask.status}>
						<div class="content" slot="completed">${this.renderContent()}</div>

						<div class="loading" slot="loading">
							<text-loading-skeleton numberOfLines="4"></text-loading-skeleton>
						</div>
					</loading-wrapper>
				</div>

				<div class="loading" slot="loading">
					<text-loading-skeleton numberOfLines="4"></text-loading-skeleton>
				</div>
			</loading-wrapper>
		`;
	}
}
