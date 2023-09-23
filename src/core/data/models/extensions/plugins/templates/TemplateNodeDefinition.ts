import { TemplateNodeMetadata } from "./TemplateNodeMetadata";
import { TemplateNodeParams } from "./TemplateNodeParams";

/**
 * Defines a template node.
 */
export interface TemplateNodeDefinition {
	metadata: TemplateNodeMetadata;
	render: (params: TemplateNodeParams) => Promise<HTMLElement>;
}
