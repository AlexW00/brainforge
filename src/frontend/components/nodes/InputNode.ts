import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { container } from "tsyringe";
import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import type { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import { CardInputField } from "../../../core/data/models/flashcards/card/Card";
import {
	NodeHandles,
	NodeInputHandleWithValue,
	NodeOutputHandle,
} from "../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { ElementRegistrarService } from "../../../core/services/app/ElementRegistrarService";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { CardInputFieldDefinition } from "../../../core/types/views/CardInputField";
import { CustomElement } from "../atomic/CustomElement";

@customElement("input-node")
export default class InputNode extends CustomElement {
	private readonly templateEditor = container.resolve(TemplateEditorService);
	private readonly elementRegistrar = container.resolve(
		ElementRegistrarService
	);

	@state()
	private cardInputFieldDefinitions: IdentifiableConstructor<
		CardInputFieldDefinition<any, any>,
		Metadata
	>[] = this.elementRegistrar.getCardInputFieldDefinitions();

	@property({ type: Object })
	params: TemplateNodeParams;

	constructor() {
		super();
		this.classList.add("container");
	}

	defaultCardInputFieldName = (): string => {
		return "New Input";
	};

	defaultCardInputFieldInputTypeId = (): string => {
		return this.cardInputFieldDefinitions[0].metadata.id;
	};

	defaultCardInputField = (): CardInputField => {
		return {
			id: this.params.id,
			name: this.defaultCardInputFieldName(),
			inputTypeId: this.defaultCardInputFieldInputTypeId(),
		};
	};

	updatedCardInputField = (args: {
		cardInputField?: CardInputField;
		id?: string;
		name?: string;
		inputTypeId?: string;
	}): CardInputField => {
		const cardInputField = args.cardInputField ?? this.defaultCardInputField();

		console.log("updated card input field", args, this.params, cardInputField);
		return {
			id: args.id ?? this.params.data?.inputField?.id ?? cardInputField.id,
			name:
				args.name ?? this.params.data?.inputField?.name ?? cardInputField.name,
			inputTypeId:
				args.inputTypeId ??
				this.params.data?.inputField?.inputTypeId ??
				cardInputField.inputTypeId,
		};
	};

	onChangeName = (e: Event) => {
		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			inputField: this.updatedCardInputField({
				name: (e.target as HTMLInputElement).value,
			}),
		});
	};

	handleInputTypeChange = (e: InputEvent) => {
		const inputTypeId = (e.target as HTMLSelectElement).value;
		const definition = this.cardInputFieldDefinitions.find(
			(definition) => definition.metadata.id === inputTypeId
		);
		if (!definition) return;

		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			inputField: this.updatedCardInputField({
				inputTypeId,
			}),
		});
	};

	render() {
		return html`
			<sl-input
				value=${this.params.data.inputField?.name ??
				this.defaultCardInputField().name}
				placeholder="Name"
				@sl-change=${this.onChangeName}
			></sl-input>
			<sl-select
				placeholder="Input Type"
				value=${ifDefined(
					this.params.data.inputField?.inputTypeId ??
						this.defaultCardInputField().inputTypeId
				)}
				@sl-input=${this.handleInputTypeChange}
			>
				${map(
					this.cardInputFieldDefinitions,
					(definition) => html`
						<sl-option value=${definition.metadata.id}>
							${definition.metadata.name}
						</sl-option>
					`
				)}
			</sl-select>
		`;
	}

	static styles = css`
		sl-option::part(base) {
			background-color: var(--bg-color);
			color: var(--fg-color);
		}
		:host {
			display: flex;
			flex-direction: column;
			gap: var(--sl-spacing-small);
		}
	`;
}

export const INPUT_NODE_DEFINITION_METADATA: TemplateNodeMetadata = {
	id: "input-node",
	name: "Input Node",
	description: "An input field node.",
	category: "Stock",
};

export class InputNodeDefinition extends TemplateNodeDefinition {
	metadata = INPUT_NODE_DEFINITION_METADATA;

	private view: InputNode;

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		if (params.outputHandles === undefined) {
			const outputHandles: NodeHandles<NodeOutputHandle> = {
				"output-1": {
					name: "Output",
					type: AnyHandle,
				},
			};

			this.nodeService.setOutputHandles(params.id, outputHandles);
		}
		this.view = new InputNode();
		this.view.params = params;
		parent.appendChild(this.view);
	};

	onUpdate = (params: TemplateNodeParams) => {
		if (!this.view) return;
		this.view.params = params;
	};

	onUnload = (params: TemplateNodeParams) => {};

	getOutputValue = async (
		outputId: string,
		params: TemplateNodeParams,
		inputs: NodeInputHandleWithValue[]
	) => {
		throw new Error("BRO dont call this shit");
	};
}

export const InputNodeDefinitionBundle: IdentifiableConstructor<
	InputNodeDefinition,
	TemplateNodeMetadata
> = {
	constructor: InputNodeDefinition,
	metadata: INPUT_NODE_DEFINITION_METADATA,
};
