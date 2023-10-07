import { CardInputFieldDefinition } from "../../types/views/CardInputField";
import { BooleanCardInputField } from "./BooleanCardInputField";
import { TextCardInputField } from "./TextCardInputField";

export const STOCK_CARD_INPUT_FIELDS: CardInputFieldDefinition<any, any>[] = [
	new TextCardInputField(),
	new BooleanCardInputField(),
];
