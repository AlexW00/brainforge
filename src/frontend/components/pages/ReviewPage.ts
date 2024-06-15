import { Task, TaskStatus } from "@lit/task";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { container } from "tsyringe";
import {
	Card,
	CardStatus,
} from "../../../core/data/models/flashcards/card/Card";
import { CardReviewAnswer } from "../../../core/data/models/flashcards/card/CardReviewData";
import { ModalService } from "../../../core/services/app/ModalService";
import { ReviewService } from "../../../core/services/app/ReviewService";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { parseDateString } from "../../../core/types/general/DateString";
import { Metadata } from "../../../core/types/general/Metadata";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { CustomElement } from "../atomic/CustomElement";
import confetti from "canvas-confetti";

@customElement("review-page")
export default class ReviewPage extends CustomElement {
	private readonly reviewService = container.resolve(ReviewService);

	@property({ type: Object })
	properties!: ReviewPageProperties;

	@state()
	private reviewStack: Card[] = [];

	@state()
	private isExpandLimitReached = false;

	private loadReviewStack = new Task(this, {
		task: async () => {
			const cards: Card[] = [];
			const deckId = this.properties.deckId;

			if (this.properties.doReviewNewCards) {
				const newCards = await this.reviewService.getNewCards(deckId);
				cards.push(...newCards);
			}

			if (this.properties.doReviewDueCards) {
				const dueCards = await this.reviewService.getDueCards(deckId);
				cards.push(...dueCards);
			}
			console.log("SETTING REVIEW STACK (load task)", cards);
			this.reviewStack = cards;
		},
		autoRun: false,
	});

	private removeCardFromStack = (cardId: string) => {
		console.log("SETTING REVIEW STACK (remove card)", cardId);
		this.reviewStack = this.reviewStack.filter((card) => card.id !== cardId);
	};

	private moveCardToBottomOfStack = (cardId: string) => {
		const card = this.reviewStack.find((card) => card.id === cardId);
		if (card === undefined) {
			console.warn("Card not found in review stack");
			return;
		}
		const newReviewStack = this.reviewStack.filter(
			(card) => card.id !== cardId
		);
		newReviewStack.push(card);
		this.reviewStack = [...newReviewStack];
		console.log("new review stack", this.reviewStack);
	};

	private onCardReviewed = (
		e: CustomEvent<{
			card: Card;
			answer: CardReviewAnswer;
		}>
	) => {
		const card = e.detail.card;
		const answer = e.detail.answer;
		const nextDueDate = card.reviewData.dueOn;

		if (nextDueDate === undefined) {
			console.warn("Card has no due date");
			this.removeCardFromStack(card.id);
			return;
		}

		const isDueToday = parseDateString(nextDueDate).getTime() <= Date.now();

		const isUpgradedNowLearningCard =
			card.status === CardStatus.New && answer !== CardReviewAnswer.Again;

		if (isDueToday) {
			this.moveCardToBottomOfStack(card.id);
		} else {
			this.removeCardFromStack(card.id);
		}
	};

	private reviewCard = (answer: CardReviewAnswer) => {
		if (this.reviewStack.length === 0) {
			console.warn("No cards to review");
			return;
		}
		console.log("Reviewing card", this.reviewStack[0].id, answer);
		const cardId = this.reviewStack[0].id;
		this.reviewService.reviewCard(cardId, answer);
	};

	private handleExpand = (e: CustomEvent) => {
		const numFoldingsToExpand = e.detail.numFoldingsToExpand;
		const maxFoldings = e.detail.maxFoldings;
		const foldingLevel = e.detail.foldingLevel;
		if (foldingLevel + numFoldingsToExpand >= maxFoldings) {
			this.isExpandLimitReached = true;
		} else {
			this.isExpandLimitReached = false;
		}
	};

	private handleReviewStackUpdated = () => {
		this.isExpandLimitReached = false;
	};

	private handleKeyboardReview = (e: KeyboardEvent) => {
		console.log(
			"Key pressed",
			e.key,
			this.reviewStack.length,
			this.isExpandLimitReached
		);
		if (this.reviewStack.length === 0) return;
		if (!this.isExpandLimitReached) return;

		if (e.key === "1") {
			this.reviewCard(CardReviewAnswer.Again);
		} else if (e.key === "2" || e.key === " ") {
			this.reviewCard(CardReviewAnswer.Good);
		} else if (e.key === "3") {
			this.reviewCard(CardReviewAnswer.Easy);
		}
	};

	private handleKeyDown = (e: KeyboardEvent) => {
		this.handleKeyboardReview(e);
	};

	connectedCallback() {
		super.connectedCallback();
		this.loadReviewStack.run();
		this.reviewService.on("cardReviewed", this.onCardReviewed);
		addEventListener("keydown", this.handleKeyDown);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.reviewService.off("cardReviewed", this.onCardReviewed);
		removeEventListener("keydown", this.handleKeyDown);
	}

	render() {
		this.focus();
		return html`
			<loading-wrapper .status=${this.loadReviewStack.status}>
				<sl-spinner style="font-size: 3rem;" slot="loading"></sl-spinner>
				<div class="content" slot="completed">
					<review-stack-view
						.cards=${this.reviewStack}
						@expand=${this.handleExpand}
						@reviewStackUpdated=${this.handleReviewStackUpdated}
					></review-stack-view>
					<!-- if review stack empty -->
					<spacer-component></spacer-component>
					${when(
						this.loadReviewStack.status !== TaskStatus.COMPLETE ||
							this.reviewStack.length === 0 ||
							!this.isExpandLimitReached,
						() => {
							return html``;
						},
						() => html`
							<review-action-bar
								@review=${(e: CustomEvent<CardReviewAnswer>) => {
									this.reviewCard(e.detail);
								}}
							></review-action-bar>
						`
					)}
				</div>
			</loading-wrapper>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex: 1;
			padding: 5rem;
		}
		.content {
			display: flex;
			flex-direction: column;
			flex: 1;
		}
	`;
}

type ReviewPageProperties = {
	deckId?: string;
	doReviewNewCards?: boolean;
	doReviewDueCards?: boolean;
};

const REVIEW_PAGE_DEFINITION_METADATA: Metadata = {
	id: "review-page",
	name: "Review",
	description: "A page to review cards",
};

export class DeckPageDefinition extends PageDefinition<ReviewPageProperties> {
	id = REVIEW_PAGE_DEFINITION_METADATA.id;
	name = REVIEW_PAGE_DEFINITION_METADATA.name;
	defaultInfo: "Review";

	private reviewPage: ReviewPage;
	private readonly modalService = container.resolve(ModalService);

	onLoad = (properties: ReviewPageProperties, container: HTMLElement) => {
		this.reviewPage = new ReviewPage();
		this.reviewPage.properties = properties;
		container.appendChild(this.reviewPage);
	};

	onUnload = () => {};

	onUpdate = (properties: ReviewPageProperties) => {
		this.reviewPage.properties = properties;
	};

	getActions() {
		return [];
	}
}

export const ReviewPageDefinitionBundle: IdentifiableConstructor<
	DeckPageDefinition,
	Metadata
> = {
	constructor: DeckPageDefinition,
	metadata: REVIEW_PAGE_DEFINITION_METADATA,
};
