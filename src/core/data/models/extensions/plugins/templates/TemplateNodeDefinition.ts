import { container } from "tsyringe";
import { TemplateEditorService } from "../../../../../services/app/TemplateEditorService";
import { TemplateNodeMetadata } from "./TemplateNodeMetadata";
import { TemplateNodeParams } from "./TemplateNodeParams";
import { NodeInputHandleWithValue } from "../../../flashcards/template/graph/nodeData/io/handles/NodeHandle";

/**
 * Defines a template node.
 */
export abstract class TemplateNodeDefinition {
	metadata: TemplateNodeMetadata;
	nodeService: TemplateEditorService = container.resolve(TemplateEditorService);

	abstract onLoad: (parent: HTMLElement, params: TemplateNodeParams) => void;
	onUpdate: (params: TemplateNodeParams) => void = () => {};

	abstract getOutputValue: (
		outputId: string,
		params: TemplateNodeParams,
		inputs: NodeInputHandleWithValue[]
	) => Promise<any>;
}
