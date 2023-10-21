import { Task } from "@lit-labs/task";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { container } from "tsyringe";
import { Card } from "../../../core/data/models/flashcards/card/Card";
import { CardReviewAnswer } from "../../../core/data/models/flashcards/card/CardReviewData";
import { ModalService } from "../../../core/services/app/ModalService";
import { ReviewService } from "../../../core/services/app/ReviewService";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { CustomElement } from "../atomic/CustomElement";

@customElement("review-page")
export default class ReviewPage extends CustomElement {
	private readonly reviewService = container.resolve(ReviewService);

	@property({ type: Object })
	properties!: ReviewPageProperties;

	@state()
	private reviewStack: Card[] = [];

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
		console.log("SETTING REVIEW STACK (move card)", cardId);
		this.reviewStack = [...newReviewStack];
	};

	private onCardReviewed = (e: CustomEvent<Card>) => {
		const card = e.detail;

		console.log("Card reviewed", card);
		const nextDueDate = card.reviewData.dueOn;
		const isDueToday = nextDueDate?.getDate() === new Date().getDate();

		if (nextDueDate === undefined) {
			console.warn("Card has no due date");
			this.removeCardFromStack(card.id);
		} else if (isDueToday) {
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

	connectedCallback() {
		super.connectedCallback();
		this.loadReviewStack.run();
		this.reviewService.on("cardReviewed", this.onCardReviewed);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.reviewService.off("cardReviewed", this.onCardReviewed);
	}

	render() {
		console.log("rendering review page", this.reviewStack);
		return html`
			<loading-wrapper .status=${this.loadReviewStack.status}>
				<sl-spinner style="font-size: 3rem;" slot="loading"></sl-spinner>
				<div class="content" slot="completed">
					<review-stack-view
						.cards=${this.reviewStack}
						@expandLimitReached=${() => {
							this.reviewCard(CardReviewAnswer.Good);
						}}
					></review-stack-view>
					<spacer-component></spacer-component>
					<review-action-bar
						@review=${(e: CustomEvent<CardReviewAnswer>) => {
							this.reviewCard(e.detail);
						}}
					></review-action-bar>
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
