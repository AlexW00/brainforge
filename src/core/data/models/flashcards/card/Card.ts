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

export interface CardRenderCache {
	[nodeId: string]: { outputName: string; value: any }[];
}

export interface CardMetaData {
	creationTimestamp: Date;
}
