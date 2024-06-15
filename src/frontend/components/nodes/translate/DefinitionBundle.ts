import { TemplateNodeDefinition } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import { IdentifiableConstructor } from "../../../../core/types/general/Constructor";
import { TranslateNodeDefinition } from "./NodeDefinition";
import { TRANSLATE_NODE_METADATA } from "./Metadata";

export const TranslateNodeDefinitionBundle: IdentifiableConstructor<
	TemplateNodeDefinition,
	TemplateNodeMetadata
> = {
	constructor: TranslateNodeDefinition,
	metadata: TRANSLATE_NODE_METADATA,
};
