import { customElement, property } from "lit/decorators.js";
import { CardInputFieldDefinition } from "../../../core/types/views/CardInputField";
import { html } from "lit";
import { CustomElement } from "../atomic/CustomElement";

@customElement("card-input-editor")
export default class CardInputEditor extends CustomElement {
	@property({ type: Array })
	cardInputFieldsIdsNames: [string, string][] = [];

	firstUpdated() {
		this.cardInputFieldsIdsNames.forEach((cardInputFieldDefinition) => {
			const container = this.shadowRoot?.querySelector(".container");
			if (!container) {
				console.error("Container not found");
				return;
			}
			console.log(cardInputFieldDefinition);
			container.innerHTML += `Name: ${cardInputFieldDefinition[1]}, Id: ${cardInputFieldDefinition[0]}<br>`;
		});
	}

	render() {
		return html` <div class="container"></div> `;
	}
}
