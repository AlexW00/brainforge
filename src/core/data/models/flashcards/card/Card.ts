import { CardReviewData } from "./CardReviewData";

export interface Card {
	id: string;
	templateId: string;

	renderCache?: CardRenderCache;
	reviewData: CardReviewData;
	metadata: CardMetaData;
}

export interface CardRenderCache {}

export interface CardMetaData {
	creationTimestamp: Date;
}
