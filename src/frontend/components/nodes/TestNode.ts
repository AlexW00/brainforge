import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";
import {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
} from "../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { AnyHandle } from "../../../core/static/nodeHandles/base/AnyHandle";

export class TestNodeDefinition extends TemplateNodeDefinition {
	metadata = {
		id: "test-node",
		name: "Test Node",
		description: "A test node.",
		category: "test",
	};

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
					value: {
						timestamp: new Date(),
						get: async (inputValues) => {
							return inputValues[0].value + "!";
						},
					},
				},
			};

			this.nodeService.setOutputHandles(params.id, outputHandles);
		}

		parent.innerHTML = `
            <div style="padding: 10px;">
                <h1>Test Node</h1>
                <p>This is a test node.</p>
            </div>
        `;
	};
}
