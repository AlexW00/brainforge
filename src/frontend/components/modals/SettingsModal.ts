import { customElement, property } from "lit/decorators.js";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { html } from "lit";

@customElement("settings-modal")
export default class SettingsModal extends CustomElement {
	constructor(properties: SettingsModalProperties) {
		super();
		if (!properties) throw new Error("Properties must be provided");
		this.properties = properties;
	}

	@property({ type: Object })
	private readonly properties: SettingsModalProperties;

	render() {
		return html`
			<div>SOME SETTINGS</div>
			${this.properties.initialCategoryId}
		`;
	}
}

export type SettingsModalProperties = {
	initialCategoryId?: string;
};

export class SettingsModalDefinition extends ModalDefinition<SettingsModalProperties> {
	public id = "settings";
	public name = "Settings";
	public onLoad = (
		properties: SettingsModalProperties,
		container: HTMLElement
	) => {
		const settingsModal = new SettingsModal(properties);
		container.appendChild(settingsModal);
	};
}
