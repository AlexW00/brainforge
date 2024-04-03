import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
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
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { FOLDING_HTML_COMMENT } from "../../../core/static/constants";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { CustomElement } from "../atomic/CustomElement";

@customElement("output-node")
export default class OutputNode extends CustomElement {
	private readonly templateEditor = container.resolve(TemplateEditorService);

	@property({ type: Object })
	params: TemplateNodeParams;

	constructor() {
		super();
		this.classList.add("container");
	}

	onClickDeleteInput = (key: string) => {
		if (!this.params.inputHandles) return;

		const newInputHandles = { ...this.params.inputHandles };
		delete newInputHandles[key];

		this.templateEditor.setInputHandles(this.params.id, newInputHandles);
	};

	onClickAddInput = () => {
		this.templateEditor.addNewInputHandle(this.params.id, "Side");
	};

	render() {
		return html`
			<sl-icon-button
				id="add-input-button"
				name="plus"
				library="ph-regular"
				label="Add card side"
				@click=${this.onClickAddInput}
			></sl-icon-button>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.input-items {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: var(--sl-spacing-small);
			width: 100%;
		}
		.remove-input-button {
			opacity: 0;
		}
		.input-item {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	`;
}

export const OUTPUT_NODE_DEFINITION_METADATA: TemplateNodeMetadata = {
	id: "output-node",
	name: "Output",
	description: "Output of a template.",
	category: "hidden",
};

export class OutputNodeDefinition extends TemplateNodeDefinition {
	metadata = OUTPUT_NODE_DEFINITION_METADATA;

	private content: OutputNode | undefined;

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		// check if params.inputHandles is an empty object
		if (params.inputHandles === undefined) {
			const inputHandles: NodeHandles<NodeInputHandle> = {
				front: {
					name: "front",
					type: AnyHandle,
				},
				back: {
					name: "back",
					type: AnyHandle,
				},
			};
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

		this.content = new OutputNode();
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
		const value = inputs.map((input) => JSON.stringify(input.value));
		const htmlString: string = `
			${inputs
				.map(
					(input: NodeInputHandleWithValue, index) => `<div class="card-side">
					${input.value}
				</div>
				${
					index !== inputs.length - 1
						? `
						${FOLDING_HTML_COMMENT}
						<sl-divider></sl-divider>
						`
						: ""
				}
				`
				)
				.join("")}
		`;
		return htmlString;
	};
}

export const OutputNodeDefinitionBundle: IdentifiableConstructor<
	TemplateNodeDefinition,
	TemplateNodeMetadata
> = {
	constructor: OutputNodeDefinition,
	metadata: OUTPUT_NODE_DEFINITION_METADATA,
};
