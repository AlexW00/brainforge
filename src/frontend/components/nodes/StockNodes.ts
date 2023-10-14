import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { TemplateNodeMetadata } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeMetadata";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { InputNodeDefinition, InputNodeDefinitionBundle } from "./InputNode";
import { OutputNodeDefinition, OutputNodeDefinitionBundle } from "./OutputNode";
import { TestNodeDefinition, TestNodeDefinitionBundle } from "./TestNode";

export const STOCK_NODES: IdentifiableConstructor<
	TemplateNodeDefinition,
	TemplateNodeMetadata
>[] = [
	TestNodeDefinitionBundle,
	OutputNodeDefinitionBundle,
	InputNodeDefinitionBundle,
];
