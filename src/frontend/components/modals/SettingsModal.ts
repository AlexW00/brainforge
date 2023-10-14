import { customElement, property } from "lit/decorators.js";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { html } from "lit";
import { Metadata } from "../../../core/types/general/Metadata";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";

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

export const SETTINGS_MODAL_METADATA: Metadata = {
	id: "settings",
	name: "Settings",
	description: "Modal to change settings",
};

export class SettingsModalDefinition extends ModalDefinition<SettingsModalProperties> {
	id = SETTINGS_MODAL_METADATA.id;
	name = SETTINGS_MODAL_METADATA.name;
	description = SETTINGS_MODAL_METADATA.description;

	public onLoad = (
		properties: SettingsModalProperties,
		container: HTMLElement
	) => {
		const settingsModal = new SettingsModal(properties);
		container.appendChild(settingsModal);
	};
}

export const SettingsModalDefinitionBundle: IdentifiableConstructor<
	ModalDefinition<SettingsModalProperties>,
	Metadata
> = {
	constructor: SettingsModalDefinition,
	metadata: SETTINGS_MODAL_METADATA,
};
