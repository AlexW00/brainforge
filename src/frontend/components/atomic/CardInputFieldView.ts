import { customElement, property, state } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";
import type {
	CardInputField,
	FilledOutCardInputField,
} from "../../../core/data/models/flashcards/card/Card";
import { PropertyValueMap, css, html } from "lit";
import { ElementRegistrarService } from "../../../core/services/app/ElementRegistrarService";
import { container } from "tsyringe";
import { CardInputFieldDefinition } from "../../../core/types/views/CardInputField";

@customElement("card-input-field-view")
export default class CardInputFieldView extends CustomElement {
	private readonly elementRegistrar = container.resolve(
		ElementRegistrarService
	);

	@property({ type: Object })
	filledOutCardInputField: FilledOutCardInputField;

	@state()
	private cardInputFieldDefinition:
		| CardInputFieldDefinition<any, any>
		| undefined = undefined;

	private onValueChanged = (e: CustomEvent<any>) => {
		console.log("value changed", e.detail);
		this.dispatchEvent(
			new CustomEvent("valueChanged", {
				detail: {
					...this.filledOutCardInputField,
					value: e.detail,
				},
				bubbles: true,
				composed: true,
			})
		);
	};

	firstUpdated() {
		const CardInputFieldDefinition =
			this.elementRegistrar.getCardInputFieldDefinitionById(
				this.filledOutCardInputField.inputTypeId
			);
		if (!CardInputFieldDefinition) {
			console.error(
				"Input element definition not found",
				this.filledOutCardInputField
			);
			return;
		}

		this.cardInputFieldDefinition = new CardInputFieldDefinition.constructor();

		const container = this.shadowRoot?.querySelector("#container");
		if (!container) {
			console.error("Container not found");
			return;
		}

		this.cardInputFieldDefinition?.onLoad(
			this.filledOutCardInputField,
			container as HTMLElement
		);

		this.cardInputFieldDefinition?.on("valueChanged", this.onValueChanged);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.cardInputFieldDefinition?.off("valueChanged", this.onValueChanged);
		this.cardInputFieldDefinition?.onUnload();
	}

	render() {
		return html`
			<div id="name">${this.filledOutCardInputField.name}</div>
			<div id="container"></div>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: row;
			gap: var(--sl-spacing-x-small);
			align-items: center;
			justify-content: center;
		}
		#name {
			width: 10rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		#container {
			flex: 1;
		}
	`;
}
