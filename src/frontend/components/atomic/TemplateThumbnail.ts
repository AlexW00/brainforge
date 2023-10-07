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
			<sl-card class="card-footer">
				<div id="image">Thumbnail image</div>
				<div id="name" slot="footer" class="no-select">
					${this.template.name}
				</div>
			</sl-card>
		`;
	}

	static styles = css`
		#image {
			flex: 1;
			height: 10rem;
		}
		#name {
			height: 2rem;
			line-height: 2rem;
			text-align: center;
		}
		sl-card::part(base):hover {
			box-shadow: var(--sl-shadow-medium);
		}
		sl-card::part(footer) {
			padding: var(--sl-spacing-x-small);
		}
		sl-card {
			width: 100%;
			height: 100%;
		}
	`;
}
