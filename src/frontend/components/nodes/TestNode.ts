import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import {
	NodeHandles,
	NodeInputHandle,
	NodeInputHandleWithValue,
	NodeOutputHandle,
} from "../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";

const TEST_NODE_METADATA: TemplateNodeMetadata = {
	id: "test-node",
	name: "Test Node",
	description: "A test node.",
	category: "test",
};

export class TestNodeDefinition extends TemplateNodeDefinition {
	metadata = TEST_NODE_METADATA;

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		// check if params.inputHandles is an empty object
		if (params.inputHandles === undefined) {
			const inputHandles: NodeHandles<NodeInputHandle> = {
				"input-1": {
					name: "Input 1",
					type: AnyHandle,
				},
			};
			this.nodeService.setInputHandles(params.id, inputHandles);
		}

		if (params.outputHandles === undefined) {
			const outputHandles: NodeHandles<NodeOutputHandle> = {
				"output-1": {
					name: "Output 1",
					type: AnyHandle,
				},
			};

			this.nodeService.setOutputHandles(params.id, outputHandles);
		}

		parent.innerHTML = `
            <div style="padding: 10px;">
                <p>Appends "-TEST".</p>
            </div>
        `;
	};

	getOutputValue = async (
		outputId: string,
		params: TemplateNodeParams,
		inputs: NodeInputHandleWithValue[]
	) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return inputs[0].value + "-TEST";
	};
}

export const TestNodeDefinitionBundle: IdentifiableConstructor<
	TemplateNodeDefinition,
	TemplateNodeMetadata
> = {
	constructor: TestNodeDefinition,
	metadata: TEST_NODE_METADATA,
};
