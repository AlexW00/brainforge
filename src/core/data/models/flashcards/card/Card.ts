import { v4 as uuidv4 } from "uuid";
import { Identifiable } from "../../../../types/general/Identifiable";
import { CardReviewData, newCardReviewData } from "./CardReviewData";

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
		creationTimestamp: Date.now(),
	},
	inputData,
});

export interface CardRenderCache {
	[nodeId: string]: {
		outputName: string;
		value: any;
		ts: number;
		dependencies: string[];
	}[];
}

export interface CardMetaData {
	creationTimestamp: number;
}

export type CardInputData = FilledOutCardInputField[];

export interface CardInputField extends Identifiable {
	name: string;
	inputTypeId: string;
}

export interface FilledOutCardInputField extends CardInputField {
	value: any;
	lastEditTs: number;
}
