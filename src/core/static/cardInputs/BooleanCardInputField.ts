import { CardInputFieldDefinition } from "../../types/views/CardInputField";

export type BooleanCardInputFieldProperties = {
	label: string;
	default?: boolean;
	value?: boolean;
};

export class BooleanCardInputField extends CardInputFieldDefinition<
	BooleanCardInputFieldProperties,
	string
> {
	public id = "boolean";
	public name = "Boolean";
	public onLoad = (
		properties: BooleanCardInputFieldProperties,
		container: HTMLElement
	) => {
		const switchEl = document.createElement("sl-switch");
		// switchEl.label = properties.label;
		switchEl.checked = properties.value ?? properties.default ?? false;
		switchEl.addEventListener("sl-change", () => {
			this.emit("valueChanged", switchEl.checked);
		});
		container.appendChild(switchEl);
	};
}
