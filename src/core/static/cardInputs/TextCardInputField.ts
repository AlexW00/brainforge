import { CardInputFieldDefinition } from "../../types/views/CardInputField";

export type TextCardInputFieldProperties = {
	label: string;
	placeholder?: string;
	value?: string;
};

export class TextCardInputField extends CardInputFieldDefinition<
	TextCardInputFieldProperties,
	string
> {
	public id = "text";
	public name = "Text";
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
