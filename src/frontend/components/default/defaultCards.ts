import {
	Card,
	CardStatus,
} from "../../../core/data/models/flashcards/card/Card";
import { DEFAULT_TEMPLATE } from "./defaultTemplate";

export const DEFAULT_CARDS: Card[] = [
	{
		id: "26c660ac-c16c-4bd3-adec-e8a030d1b9f4",
		templateId: DEFAULT_TEMPLATE.id,
		status: CardStatus.New,
		reviewData: {
			reviews: [],
			dueOn: "2024-06-12T17:45:15.151Z",
		},
		metadata: {
			creationTimestamp: "2024-06-12T17:45:15.151Z",
		},
		inputData: [
			{
				id: "282093d3-3297-4f66-8b3a-ddfb09aae577",
				name: "Japanese",
				inputTypeId: "text",
				value: "友達",
			},
		],
	},
	{
		id: "26c660ac-c16c-4bd3-adec-e8a030d1b9f5",
		templateId: DEFAULT_TEMPLATE.id,
		status: CardStatus.New,
		reviewData: {
			reviews: [],
			dueOn: "2024-06-12T17:45:15.151Z",
		},
		metadata: {
			creationTimestamp: "2024-06-12T17:45:15.151Z",
		},
		inputData: [
			{
				id: "282093d3-3297-4f66-8b3a-ddfb09aae577",
				name: "Japanese",
				inputTypeId: "text",
				value: "働く",
			},
		],
	},
];
