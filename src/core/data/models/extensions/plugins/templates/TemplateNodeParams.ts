import {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
} from "../../../flashcards/template/graph/nodeData/io/handles/NodeHandle";

/**
 * Template node params.
 * During rendering, the params are passed to the render function of the node definition.
 * @TODO: Define the params.
 */
export type TemplateNodeParams = {
	data: any;
	doCache: boolean;
	inputHandles: NodeHandles<NodeInputHandle>;
	outputHandles: NodeHandles<NodeOutputHandle>;
};
