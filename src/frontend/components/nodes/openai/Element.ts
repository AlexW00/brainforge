import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { container } from "tsyringe";
import type { TemplateNodeParams } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import { TemplateEditorService } from "../../../../core/services/app/TemplateEditorService";
import { CustomElement } from "../../atomic/CustomElement";

@customElement("openai-node")
export default class OpenAiNode extends CustomElement {
	private readonly templateEditor = container.resolve(TemplateEditorService);

	@property({ type: Object })
	params: TemplateNodeParams;

	private readonly models = ["gpt-3.5-turbo", "gpt-4-turbo-preview", "gpt-4"];

	constructor() {
		super();
		this.classList.add("container");
	}

	onApiKeyChange = (event: InputEvent) => {
		const apiKey = (event.target as HTMLInputElement).value;

		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			apiKey,
		});
	};

	onModelChange = (event: InputEvent) => {
		const model = (event.target as HTMLSelectElement).value;

		if (model === undefined) return;

		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			model,
		});
	};

	render() {
		return html`
			<sl-input
				value=${ifDefined(this.params.data.apiKey)}
				placeholder="OpenAI API Key"
				@sl-input=${this.onApiKeyChange}
				type="password"
			></sl-input>

			<sl-select
				value=${this.params.data.model ?? this.models[0]}
				@sl-input=${this.onModelChange}
			>
				${this.models.map(
					(model) => html`<sl-option value=${model}>${model}</sl-option>`
				)}
			</sl-select>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	`;
}
