import { IdentifiableConstructor } from "../../types/general/Constructor";
import { Metadata } from "../../types/general/Metadata";
import { CardInputFieldDefinition } from "../../types/views/CardInputField";

export type TextCardInputFieldProperties = {
	label: string;
	placeholder?: string;
	value?: string;
};

export const TEXT_CARD_INPUT_FIELD_METADATA: Metadata = {
	id: "text",
	name: "Text",
	description: "A simple text input field.",
};

export class TextCardInputField extends CardInputFieldDefinition<
	TextCardInputFieldProperties,
	string
> {
	id = TEXT_CARD_INPUT_FIELD_METADATA.id;
	name = TEXT_CARD_INPUT_FIELD_METADATA.name;
	description = TEXT_CARD_INPUT_FIELD_METADATA.description;

	public onLoad = (
		properties: TextCardInputFieldProperties,
		container: HTMLElement
	) => {
		const input = document.createElement("sl-input");
		input.label = properties.label;
		input.placeholder = properties.placeholder ?? "";
		input.value = properties.value ?? "";
		input.addEventListener("sl-change", () => {
			this.onChange(input.value);
		});
		container.appendChild(input);
	};
}

export const TextCardInputFieldDefinitionBundle: IdentifiableConstructor<
	CardInputFieldDefinition<TextCardInputFieldProperties, string>,
	Metadata
> = {
	constructor: TextCardInputField,
	metadata: TEXT_CARD_INPUT_FIELD_METADATA,
};
