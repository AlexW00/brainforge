import {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
	NodeOutputHandleValueFunction,
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

	setData: (data: any) => void;
	setDoCache: (doCache: boolean) => void;

	setInputHandles: (handles: NodeHandles<NodeInputHandle>) => void;
	setOutputHandles: (handles: NodeHandles<NodeOutputHandle>) => void;

	setOutputHandleValue: (data: {
		name: string;
		value: NodeOutputHandleValueFunction;
	}) => void;
};
