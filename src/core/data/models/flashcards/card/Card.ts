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
	inputData: CardInputData;
}

export interface CardRenderCache {
	[nodeId: string]: { outputName: string; value: any; ts: Date }[];
}

export interface CardMetaData {
	creationTimestamp: Date;
}

export interface CardInputData {
	[key: string]: any;
}
