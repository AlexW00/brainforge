import { IdentifiableConstructor } from "../../types/general/Constructor";
import { Metadata } from "../../types/general/Metadata";
import { CardInputFieldDefinition } from "../../types/views/CardInputField";

export type BooleanCardInputFieldProperties = {
	label: string;
	default?: boolean;
	value?: boolean;
};

export const BOOLEAN_CARD_INPUT_FIELD_METADATA: Metadata = {
	id: "boolean",
	name: "Boolean",
	description: "A simple boolean input field.",
};

export class BooleanCardInputField extends CardInputFieldDefinition<
	BooleanCardInputFieldProperties,
	boolean
> {
	id = BOOLEAN_CARD_INPUT_FIELD_METADATA.id;
	name = BOOLEAN_CARD_INPUT_FIELD_METADATA.name;
	description = BOOLEAN_CARD_INPUT_FIELD_METADATA.description;

	public onLoad = (
		properties: BooleanCardInputFieldProperties,
		container: HTMLElement
	) => {
		const switchEl = document.createElement("sl-switch");
		// switchEl.label = properties.label;
		switchEl.checked = properties.value ?? properties.default ?? false;
		switchEl.addEventListener("sl-change", () => {
			this.onChange(switchEl.checked);
		});
		container.appendChild(switchEl);
	};
}

export const BooleanCardInputFieldDefinitionBundle: IdentifiableConstructor<
	CardInputFieldDefinition<BooleanCardInputFieldProperties, boolean>,
	Metadata
> = {
	constructor: BooleanCardInputField,
	metadata: BOOLEAN_CARD_INPUT_FIELD_METADATA,
};
