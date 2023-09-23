import { NodeHandles } from "./handles/NodeHandle";

/**
 * A map of node input and output handles of a node.
 */
export interface NodeIO {
	inputs: NodeHandles;
	outputs: NodeHandles;
}
