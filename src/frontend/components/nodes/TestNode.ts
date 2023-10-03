import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeParams } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeParams";

export class TestNodeDefinition extends TemplateNodeDefinition {
	metadata = {
		id: "test-node",
		name: "Test Node",
		description: "A test node.",
		category: "test",
	};

	onLoad = (parent: HTMLElement, params: TemplateNodeParams) => {
		parent.innerHTML = `
            <div style="padding: 10px;">
                <h1>Test Node</h1>
                <p>This is a test node.</p>
            </div>
        `;
	};
}
