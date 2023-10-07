import { TemplateNodeDefinition } from "../../../core/data/models/extensions/plugins/templates/TemplateNodeDefinition";
import { InputNodeDefinition } from "./InputNode";
import { OutputNodeDefinition } from "./OutputNode";
import { TestNodeDefinition } from "./TestNode";

export const STOCK_NODES: TemplateNodeDefinition[] = [
	new TestNodeDefinition(),
	new OutputNodeDefinition(),
	new InputNodeDefinition(),
];
