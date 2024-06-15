import { Task } from "@lit/task";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { container } from "tsyringe";
import type { Card } from "../../../core/data/models/flashcards/card/Card";
import { CardRenderService } from "../../../core/services/app/CardRenderService";
import { PouchCardService } from "../../../core/services/storage/pouch/docs/multi/PouchCardService";
import { FOLDING_HTML_COMMENT } from "../../../core/static/constants";
import { CustomElement } from "./CustomElement";

@customElement("flashcard-content")
export default class FlashcardContent extends CustomElement {
	private readonly cardService = container.resolve(PouchCardService);
	private readonly cardRendererService = container.resolve(CardRenderService);

	constructor() {
		super();
		this.classList.add("container");
	}

	@property({ type: String })
	cardId: string;

	@property({ type: Number })
	foldingLevel: number = -1;

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
			console.log("load card status", this.loadCardTask.status);
			if (this.card === undefined) return;
			this.cardHtml = await this.cardRendererService.renderCard(this.card.id);
			return this.cardHtml;
		},
		autoRun: false,
	});

	onCardIdChanged() {
		if (this.cardId === undefined) return;
		this.loadCardTask
			.run()
			.then(() => this.renderCardTask.run())
			.catch((e: any) => console.error("ERROR", e));
	}

	onCardChanged = (e: CustomEvent<Card>) => {
		if (e.detail.id !== this.cardId) return;
		this.card = e.detail;
		this.renderCardTask.run();
	};

	private getNumFoldings = () => {
		if (this.cardHtml === undefined) return 0;
		return this.cardHtml.split(FOLDING_HTML_COMMENT).length;
	};

	private onExpandLimitReached = () => {
		this.dispatchEvent(
			new CustomEvent("expandLimitReached", {
				bubbles: true,
				composed: true,
			})
		);
	};

	private onExpand = (numFoldingsToExpand: number) => {
		this.dispatchEvent(
			new CustomEvent("expand", {
				detail: {
					numFoldingsToExpand,
					maxFoldings: this.getNumFoldings(),
					foldingLevel: this.foldingLevel,
				},
				bubbles: true,
				composed: true,
			})
		);
	};

	private onTryExpand = () => {
		const numFoldings = this.getNumFoldings();
		if (numFoldings === 0) return; // no foldings
		if (this.foldingLevel === -1) return; // already fully expanded

		if (numFoldings <= this.foldingLevel) this.onExpandLimitReached();
		else this.onExpand(1);
	};

	private handleSpacePress = () => {
		this.onTryExpand();
	};

	private handleContentClick = () => {
		this.onTryExpand();
	};

	private handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === " ") this.handleSpacePress();
	};

	updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (changedProperties.has("cardId")) this.onCardIdChanged();
	}

	connectedCallback() {
		super.connectedCallback();
		console.log("connected flashcard content", this.cardId);
		this.cardService.on("change", this.onCardChanged);
		addEventListener("keydown", this.handleKeyDown);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.cardService.off("change", this.onCardChanged);
		removeEventListener("keydown", this.handleKeyDown);
	}

	renderContent = (foldingLevel: number) => {
		if (this.cardHtml === undefined) return "";
		const foldings = this.cardHtml.split(FOLDING_HTML_COMMENT);
		if (foldings.length === 1 || foldingLevel === -1)
			return unsafeHTML(this.cardHtml);

		const maxFoldings = this.getNumFoldings(),
			foldUntil = Math.min(foldingLevel, maxFoldings);

		const foldedHtml = foldings.slice(0, foldUntil).join("");
		return unsafeHTML(foldedHtml);
	};

	render() {
		if (this.renderCardTask.error) console.error(this.renderCardTask.error);
		return html`
			<loading-wrapper
				.status=${this.loadCardTask.status}
				errorMessage=${this.loadCardTask.error as string}
			>
				<div class="content" slot="completed">
					<loading-wrapper
						status=${this.renderCardTask.status}
						errorMessage=${this.renderCardTask.error as string}
						@reload=${() => this.renderCardTask.run()}
					>
						<div
							class="content"
							slot="completed"
							@click=${this.handleContentClick}
						>
							${this.renderContent(this.foldingLevel)}
						</div>

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

	static styles = css`
		.content {
			display: flex;
			flex-direction: column;
		}
	`;
}
