import {
	NodeHandles,
	NodeInputHandle,
	NodeOutputHandle,
} from "./handles/NodeHandle";

/**
 * A map of node input and output handles of a node.
 */
export interface NodeIO {
	inputs: NodeHandles<NodeInputHandle>;
	outputs: NodeHandles<NodeOutputHandle>;
}
