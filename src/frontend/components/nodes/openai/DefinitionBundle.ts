import { TemplateNodeDefinition } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import { IdentifiableConstructor } from "../../../../core/types/general/Constructor";
import { OpenAiNodeDefinition } from "./NodeDefinition";
import { OPENAI_NODE_METADATA } from "./Metadata";

export const OpenAiNodeDefinitionBundle: IdentifiableConstructor<
	TemplateNodeDefinition,
	TemplateNodeMetadata
> = {
	constructor: OpenAiNodeDefinition,
	metadata: OPENAI_NODE_METADATA,
};
