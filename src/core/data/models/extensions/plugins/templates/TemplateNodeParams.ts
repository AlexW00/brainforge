import {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
} from "../../../flashcards/template/graph/nodeData/io/handles/NodeHandle";

/**
 * Template node params.
 * During rendering, the params are passed to the render function of the node definition.
 */
export type TemplateNodeParams = {
	id: string; // The id of the node (different from the id of the node definition)
	data: any; // Additional extra data of the node
	doCache: boolean; // Whether to cache the outputs of the node
	inputHandles?: NodeHandles<NodeInputHandle>; // The input handles of the node
	outputHandles?: NodeHandles<NodeOutputHandle>; // The output handles of the node
};
