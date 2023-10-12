import { customElement, property } from "lit/decorators";
import { CardInputFieldDefinition } from "../../../core/types/views/CardInputField";
import { html } from "lit";

@customElement("card-input-editor")
export default class CardInputEditor extends HTMLElement {
	@property({ type: Array })
	cardInputFieldDefinitions: CardInputFieldDefinition<any, any>[] = [];

	firstUpdated() {
		this.cardInputFieldDefinitions.forEach((cardInputFieldDefinition) => {
			const container = this.querySelector(".container");
			if (!container) {
				console.error("Container not found");
				return;
			}
			// const cardInputField = cardInputFieldDefinition.onLoad(container)
		});
	}

	render() {
		return html` <div class="container"></div> `;
	}
}
