import { CardReviewData } from "./CardReviewData";

export enum CardStatus {
	New = "new",
	Learning = "learning",
	Archived = "archived",
	Trashed = "trashed",
}

export interface Card {
	id: string;
	templateId: string;
	status: CardStatus;

	renderCache?: CardRenderCache;
	reviewData: CardReviewData;
	metadata: CardMetaData;
}

export interface CardRenderCache {}

export interface CardMetaData {
	creationTimestamp: Date;
}
