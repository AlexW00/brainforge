import { customElement, property } from "lit/decorators.js";
import { Template } from "../../../core/data/models/flashcards/template/Template";
import { html } from "lit";
import { map } from "lit/directives/map.js";
import { CustomElement } from "./CustomElement";

@customElement("template-select")
export default class TemplateSelect extends CustomElement {
	@property({ type: Array })
	private templates: Template[] = [];

	@property({ type: String })
	private selectedTemplateId?: string;

	render() {
		return html`
			<sl-select
				size="small"
				.value=${this.selectedTemplateId ?? ""}
				@sl-select=${(e: CustomEvent) => {
					const templateId = e.detail.value;
					console.log(templateId);
					if (templateId === undefined) return;
					this.dispatchEvent(
						new CustomEvent("template-select", {
							detail: templateId,
						})
					);
				}}
			>
				${map(
					this.templates,
					(template) => html`
						<sl-option value=${template.id}> ${template.name} </sl-option>
					`
				)}
			</sl-select>
		`;
	}
}
