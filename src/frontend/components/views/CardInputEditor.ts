import { customElement, property, state } from "lit/decorators.js";
import { CardInputFieldDefinition } from "../../../core/types/views/CardInputField";
import { PropertyValueMap, css, html } from "lit";
import { CustomElement } from "../atomic/CustomElement";
import {
	CardInputData,
	CardInputField,
	FilledOutCardInputField,
} from "../../../core/data/models/flashcards/card/Card";
import { map } from "lit/directives/map.js";

@customElement("card-input-editor")
export default class CardInputEditor extends CustomElement {
	@property({ type: Array })
	filledOutCardInputFields: FilledOutCardInputField[] = [];

	private onCardInputFieldValueChanged = (
		e: CustomEvent<FilledOutCardInputField>
	) => {
		const newFilledOutCardInputFields = this.filledOutCardInputFields.map(
			(filledOutCardInputField) => {
				if (filledOutCardInputField.id === e.detail.id) {
					return {
						...filledOutCardInputField,
						value: e.detail.value,
					};
				}
				return filledOutCardInputField;
			}
		);
		console.log("changed", e.detail, newFilledOutCardInputFields);
		e.stopPropagation();

		this.dispatchEvent(
			new CustomEvent("cardInputFieldsChanged", {
				detail: newFilledOutCardInputFields,
			})
		);
	};

	render() {
		console.log("render input fields", this.filledOutCardInputFields);
		return html`
			${map(
				this.filledOutCardInputFields,
				(cardInputField) => html`
					<card-input-field-view
						@valueChanged=${this.onCardInputFieldValueChanged}
						.filledOutCardInputField=${cardInputField}
					></card-input-field-view>
				`
			)}
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			gap: var(--sl-spacing-large);
		}
	`;
}
