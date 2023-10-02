import { TemplateNodeMetadata } from "./TemplateNodeMetadata";
import { TemplateNodeParams } from "./TemplateNodeParams";

/**
 * Defines a template node.
 */
export interface TemplateNodeDefinition {
	metadata: TemplateNodeMetadata;
	onLoad: (parent: HTMLElement, params: TemplateNodeParams) => void;
}
