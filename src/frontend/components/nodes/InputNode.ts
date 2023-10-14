import { customElement, property, state } from "lit/decorators.js";
import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import type { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import {
	NodeHandles,
	NodeInputHandleWithValue,
	NodeOutputHandle,
} from "../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";
import { CustomElement } from "../atomic/CustomElement";
import { container } from "tsyringe";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { ElementRegistrarService } from "../../../core/services/app/ElementRegistrarService";
import { css, html } from "lit";
import { CardInputFieldDefinition } from "../../../core/types/views/CardInputField";
import { map } from "lit/directives/map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { CardInputField } from "../../../core/data/models/flashcards/card/Card";
import { useNodeId } from "../../react/hooks/context/useNodeId";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { TemplateNodeMetadata } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";

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

	updatedCardInputField = (props: {
		cardInputField?: CardInputField;
		id?: string;
		name?: string;
		inputTypeId?: string;
	}): CardInputField => {
		const cardInputField = props.cardInputField ?? this.defaultCardInputField();

		return {
			id: props.id ?? cardInputField.id,
			name: props.name ?? cardInputField.name,
			inputTypeId: props.inputTypeId ?? cardInputField.inputTypeId,
		};
	};

	onChangeInputType = (id: string) => {
		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			inputField: this.updatedCardInputField({
				inputTypeId: id,
			}),
		});
	};

	onChangeName = (e: Event) => {
		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			inputField: this.updatedCardInputField({
				name: (e.target as HTMLInputElement).value,
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
			>
				${map(
					this.cardInputFieldDefinitions,
					(definition) => html`
						<sl-option
							value=${definition.metadata.id}
							@click=${() => this.onChangeInputType(definition.metadata.id)}
						>
							${definition.metadata.name}</sl-option
						>
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
