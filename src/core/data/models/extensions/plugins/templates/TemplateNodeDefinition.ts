import { container } from "tsyringe";
import { EditorNodeService } from "../../../../../services/app/EditorNodeService";
import { TemplateNodeMetadata } from "./TemplateNodeMetadata";
import { TemplateNodeParams } from "./TemplateNodeParams";

/**
 * Defines a template node.
 */
export abstract class TemplateNodeDefinition {
	metadata: TemplateNodeMetadata;
	nodeService: EditorNodeService = container.resolve(EditorNodeService);

	abstract onLoad: (parent: HTMLElement, params: TemplateNodeParams) => void;
}
