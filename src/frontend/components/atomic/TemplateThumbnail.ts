import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";
import type { Template } from "../../../core/data/models/flashcards/template/Template";
import { css, html } from "lit";

@customElement("template-thumbnail")
export default class TemplateThumbnail extends CustomElement {
	@property({ type: Object })
	template!: Template;

	render() {
		return html`
			<card-element>
				<div id="image">Thumbnail image</div>
				<div id="name" class="no-select">${this.template.name}</div>
			</card-element>
		`;
	}

	static styles = css`
		card-element {
			max-width: 1fr;
			height: 10rem;
			display: flex;
			flex-direction: column;
		}
		#image {
			flex: 1;
		}
		#name {
			height: 2rem;
			line-height: 2rem;

			border-top: var(--border-width-small) solid var(--border-color);
			text-align: center;
		}
	`;
}
