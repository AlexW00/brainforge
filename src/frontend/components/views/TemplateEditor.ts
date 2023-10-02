import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import type { Template } from "../../../core/data/models/flashcards/template/Template";
import { html } from "lit";

@customElement("template-editor")
export default class TemplateEditor extends CustomElement {
	@property({ type: Object })
	template!: Template;

	render() {
		return html` ${this.template.name} `;
	}
}
