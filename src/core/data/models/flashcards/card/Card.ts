import { CardReviewData } from "./CardReviewData";

export interface Card {
	id: string;
	templateId: string;

	renderCache: CardRenderCache;
	reviewData: CardReviewData;
	metaData: CardMetaData;
}

export interface CardRenderCache {}

export interface CardMetaData {
	creationTimestamp: number;
}
