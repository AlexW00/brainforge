import { customElement, property } from "lit/decorators.js";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CustomElement } from "../atomic/CustomElement";
import { css, html } from "lit";
import { Metadata } from "../../../core/types/general/Metadata";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { container } from "tsyringe";
import { PouchPreferencesService } from "../../../core/services/storage/pouch/docs/single/PouchPreferencesService";
import { Task, TaskStatus } from "@lit/task/task.js";
import { Preferences } from "../../../core/data/models/Preferences";

@customElement("settings-modal")
export default class SettingsModal extends CustomElement {
	private readonly preferencesSercice = container.resolve(
		PouchPreferencesService
	);

	private preferences: Preferences;

	private loadPreferencesTask = new Task(this, {
		task: async () => {
			this.preferences = (await this.preferencesSercice.get())!;
		},
		autoRun: false,
	});

	connectedCallback() {
		super.connectedCallback();
		this.loadPreferencesTask.run();
		this.preferencesSercice.addChangeListener(() =>
			this.loadPreferencesTask.run()
		);
	}

	constructor(properties: SettingsModalProperties) {
		super();
		if (!properties) throw new Error("Properties must be provided");
		this.properties = properties;
	}

	@property({ type: Object })
	private readonly properties: SettingsModalProperties;

	private onOpenaiApiKeyChange = (e: Event) => {
		const input = e.target as HTMLInputElement;
		this.preferencesSercice.updateFields({
			openaiApiKey: input.value,
		});
	};

	render() {
		// if settings are not loaded yet, show loading spinner
		return html`<div>
			${this.loadPreferencesTask.status !== TaskStatus.COMPLETE
				? html`<div>Loading...</div>`
				: html`<div class="settings-content">
						<sl-input
							label="OpenAI API Key"
							type="password"
							password-toggle
							.value=${this.preferences.openaiApiKey}
							@sl-input=${this.onOpenaiApiKeyChange}
						></sl-input>
				  </div>`}
		</div>`;
	}

	static styles = css`
		.settings-content {
			display: grid;
			grid-template-columns: 1fr;
			grid-gap: 1rem;
		}
	`;
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
