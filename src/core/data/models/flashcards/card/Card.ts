import { v4 as uuidv4 } from "uuid";
import {
	DateString,
	newDateString,
} from "../../../../types/general/DateString";
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
		creationTimestamp: newDateString(),
	},
	inputData,
});

export interface CardRenderCache {
	[nodeId: string]: { outputName: string; value: any; ts: DateString }[];
}

export interface CardMetaData {
	creationTimestamp: DateString;
}

export type CardInputData = FilledOutCardInputField[];

export interface CardInputField extends Identifiable {
	name: string;
	inputTypeId: string;
}

export interface FilledOutCardInputField extends CardInputField {
	value: any;
}
