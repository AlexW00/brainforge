import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import Mustache from "mustache";
import { container } from "tsyringe";
import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import type { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import type {
	NodeHandles,
	NodeInputHandle,
	NodeInputHandleWithValue,
	NodeOutputHandle,
} from "../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { LoggerService } from "../../../core/services/app/LoggerService";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { CustomElement } from "../atomic/CustomElement";

@customElement("templating-node")
export default class TemplatingNode extends CustomElement {
	private readonly templateEditor = container.resolve(TemplateEditorService);

	@property({ type: Object })
	params: TemplateNodeParams;

	constructor() {
		super();
		this.classList.add("container");
	}

	onClickAddInput = () => {
		this.templateEditor.addNewInputHandle(this.params.id, "Input");
	};

	onInputChanged = (e: Event) => {
		const input = e.target as HTMLInputElement;
		const template = input.value;
		this.templateEditor.setData(this.params.id, { template });
	};

	render() {
		console.log("template", this.params.data);
		return html`
			<sl-icon-button
				id="add-input-button"
				name="plus"
				library="ph-regular"
				label="Add card side"
				@click=${this.onClickAddInput}
			></sl-icon-button>

			<sl-textarea
				name="template"
				placeholder="My input is {{Input-1}}"
				value=${this.params.data.template}
				@input=${this.onInputChanged}
			></sl-textarea>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		#add-input-button {
			margin-bottom: 10px;
		}
	`;
}

export const TEMPLATING_NODE_DEFINITION_METADATA: TemplateNodeMetadata = {
	id: "templating-node",
	name: "Template",
	description: "Templating node",
	category: "Stock",
};

export class TemplatingNodeDefinition extends TemplateNodeDefinition {
	metadata = TEMPLATING_NODE_DEFINITION_METADATA;

	private content: TemplatingNode | undefined;
	private loggerService = container.resolve(LoggerService);

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		// check if params.inputHandles is an empty object
		if (params.inputHandles === undefined) {
			const inputHandles: NodeHandles<NodeInputHandle> = {};
			this.nodeService.setInputHandles(params.id, inputHandles);
		}

		if (params.outputHandles === undefined) {
			const outputHandles: NodeHandles<NodeOutputHandle> = {
				out: {
					name: "out",
					type: AnyHandle,
				},
			};
			this.nodeService.setOutputHandles(params.id, outputHandles);
		}

		this.content = new TemplatingNode();
		this.content.params = params;

		parent.appendChild(this.content);
	};

	onUpdate = (params: TemplateNodeParams) => {
		if (!this.content) return;
		this.content.params = params;
	};
	getOutputValue = async (
		outputId: string,
		params: TemplateNodeParams,
		inputs: NodeInputHandleWithValue[]
	) => {
		const view = inputs.reduce(
			(acc, input) => ({ ...acc, [input.name]: input.value }),
			{}
		);
		const template = params.data.template ?? "";
		this.loggerService.log(view, template);

		return Mustache.render(template, view);
	};
}

export const TemplatingNodeDefinitionBundle: IdentifiableConstructor<
	TemplateNodeDefinition,
	TemplateNodeMetadata
> = {
	constructor: TemplatingNodeDefinition,
	metadata: TEMPLATING_NODE_DEFINITION_METADATA,
};
