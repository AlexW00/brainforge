import { IdentifiableConstructor } from "../../types/general/Constructor";
import { Metadata } from "../../types/general/Metadata";
import { CardInputFieldDefinition } from "../../types/views/CardInputField";
import {
	BooleanCardInputField,
	BooleanCardInputFieldDefinitionBundle,
} from "./BooleanCardInputField";
import {
	TextCardInputField,
	TextCardInputFieldDefinitionBundle,
} from "./TextCardInputField";

export const STOCK_CARD_INPUT_FIELDS: IdentifiableConstructor<
	CardInputFieldDefinition<any, any>,
	Metadata
>[] = [
	TextCardInputFieldDefinitionBundle,
	BooleanCardInputFieldDefinitionBundle,
];
