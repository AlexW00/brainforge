import { Identifiable } from "../../../../types/general/Identifiable";
import { CardReviewData, newCardReviewData } from "./CardReviewData";
import { v4 as uuidv4 } from "uuid";

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

export const newCard = (
	templateId: string,
	inputData: CardInputData = []
): Card => ({
	id: uuidv4(),
	templateId,
	status: CardStatus.New,
	reviewData: newCardReviewData(),
	metadata: {
		creationTimestamp: new Date(),
	},
	inputData,
});

export interface CardRenderCache {
	[nodeId: string]: { outputName: string; value: any; ts: Date }[];
}

export interface CardMetaData {
	creationTimestamp: Date;
}

export type CardInputData = FilledOutCardInputField[];

export interface CardInputField extends Identifiable {
	name: string;
	inputTypeId: string;
}

export interface FilledOutCardInputField extends CardInputField {
	value: any;
}
