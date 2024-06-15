import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { container } from "tsyringe";
import type { TemplateNodeParams } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import { TemplateEditorService } from "../../../../core/services/app/TemplateEditorService";
import { CustomElement } from "../../atomic/CustomElement";

@customElement("translate-node")
export default class TranslateNode extends CustomElement {
	private readonly templateEditor = container.resolve(TemplateEditorService);

	@property({ type: Object })
	params: TemplateNodeParams;

	private readonly languages = [
		"English",
		"Spanish",
		"French",
		"German",
		"Japanese",
		"Korean",
		"Chinese",
		"Russian",
		"Arabic",
		"Portuguese",
	];

	constructor() {
		super();
		this.classList.add("container");
	}

	onLanguageChange = (event: InputEvent) => {
		const lang = (event.target as HTMLSelectElement).value;

		if (lang === undefined) return;

		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			language: lang,
		});
	};

	render() {
		return html`
			<sl-select
				value=${this.params.data.model ?? this.languages[0]}
				@sl-input=${this.onLanguageChange}
			>
				${this.languages.map(
					(lang) => html`<sl-option value=${lang}>${lang}</sl-option>`
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
