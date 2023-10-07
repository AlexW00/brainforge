import { customElement, property } from "lit/decorators.js";
import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import type { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import type {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
} from "../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";
import { CustomElement } from "../atomic/CustomElement";
import { css, html } from "lit";
import { map } from "lit/directives/map.js";
import { when } from "lit/directives/when.js";
import { TemplateEditorService } from "../../../core/services/app/TemplateEditorService";
import { container } from "tsyringe";

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
			<div class="input-items">
				${when(this.params.inputHandles !== undefined, () =>
					map(
						Object.keys(this.params.inputHandles!),
						(key: string, i: number) => html`<div class="input-item">
							${this.params.inputHandles![key].name}
							<sl-icon-button
								class="remove-input-button"
								name="trash-simple"
								library="ph-regular"
								label="Remove card side"
								@click=${() => this.onClickDeleteInput(key)}
							></sl-icon-button>
						</div> `
					)
				)}
			</div>
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

		.input-item:hover .remove-input-button {
			opacity: 1;
		}
		#add-input-button {
			margin-top: var(--sl-spacing-medium);
			display: none;
		}
		:host(:hover) #add-input-button {
			display: block;
		}
	`;
}

export class OutputNodeDefinition extends TemplateNodeDefinition {
	metadata = {
		id: "output-node",
		name: "Output",
		description: "Output of a template.",
		category: "hidden",
	};

	private content: OutputNode | undefined;

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		// check if params.inputHandles is an empty object
		if (params.inputHandles === undefined) {
			const inputHandles: NodeHandles<NodeInputHandle> = {
				front: {
					name: "Side 1",
					type: AnyHandle,
				},
				back: {
					name: "Side 2",
					type: AnyHandle,
				},
			};
			this.nodeService.setInputHandles(params.id, inputHandles);
		}

		if (params.outputHandles === undefined) {
			const outputHandles: NodeHandles<NodeOutputHandle> = {
				output: {
					name: "out",
					type: AnyHandle,
					value: {
						timestamp: new Date(),
						get: async (inputValues: { name: string; value: any }[]) => {
							return inputValues[0].value;
						},
					},
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
}
