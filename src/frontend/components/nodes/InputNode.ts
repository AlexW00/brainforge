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

@customElement("input-node")
export default class InputNode extends CustomElement {
	private readonly templateEditor = container.resolve(TemplateEditorService);
	private readonly elementRegistrar = container.resolve(
		ElementRegistrarService
	);

	@state()
	private cardInputFieldDefinitions: CardInputFieldDefinition<any, any>[] =
		this.elementRegistrar.getCardInputFieldDefinitions();

	@property({ type: Object })
	params: TemplateNodeParams;

	constructor() {
		super();
		this.classList.add("container");
	}

	onChangeInput = (id: string) => {
		this.templateEditor.setData(this.params.id, {
			...this.params.data,
			inputTypeId: id,
		});
	};

	render() {
		return html`
			<sl-select
				placeholder="Input Type"
				value=${ifDefined(this.params.data.inputTypeId)}
			>
				${map(
					this.cardInputFieldDefinitions,
					(definition: CardInputFieldDefinition<any, any>) => html`
						<sl-option
							value=${definition.id}
							@click=${() => this.onChangeInput(definition.id)}
						>
							${definition.name}</sl-option
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

export class InputNodeDefinition extends TemplateNodeDefinition {
	metadata = {
		id: "input-node",
		name: "Input Node",
		description: "An input field node.",
		category: "Stock",
	};

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
