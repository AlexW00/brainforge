import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { container } from "tsyringe";
import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import type { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import {
	NodeHandles,
	NodeOutputHandle,
} from "../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { CustomElement } from "../atomic/CustomElement";

@customElement("text-node")
export default class TextNode extends CustomElement {
	private readonly templateEditor = container.resolve(TemplateEditorService);

	@property({ type: Object })
	params: TemplateNodeParams;

	constructor() {
		super();
		this.classList.add("container");
	}

	onInputChanged = (e: Event) => {
		const input = e.target as HTMLInputElement;
		const text = input.value;
		this.templateEditor.setData(this.params.id, { text });
	};

	render() {
		return html`
			<sl-input
				name="text"
				placeholder="Enter text here"
				value=${this.params.data.text || ""}
				@input=${this.onInputChanged}
			></sl-input>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	`;
}

export const TEXT_NODE_DEFINITION_METADATA: TemplateNodeMetadata = {
	id: "text-node",
	name: "Text",
	description: "Text node",
	category: "Stock",
};

export class TextNodeDefinition extends TemplateNodeDefinition {
	metadata = TEXT_NODE_DEFINITION_METADATA;

	private content: TextNode | undefined;

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		if (params.outputHandles === undefined) {
			const outputHandles: NodeHandles<NodeOutputHandle> = {
				out: {
					name: "out",
					type: AnyHandle,
				},
			};
			this.nodeService.setOutputHandles(params.id, outputHandles);
		}

		this.content = new TextNode();
		this.content.params = params;

		parent.appendChild(this.content);
	};

	onUpdate = (params: TemplateNodeParams) => {
		if (!this.content) return;
		this.content.params = params;
	};

	getOutputValue = async (outputId: string, params: TemplateNodeParams) => {
		return params.data.text || "";
	};
}

export const TextNodeDefinitionBundle: IdentifiableConstructor<
	TemplateNodeDefinition,
	TemplateNodeMetadata
> = {
	constructor: TextNodeDefinition,
	metadata: TEXT_NODE_DEFINITION_METADATA,
};
