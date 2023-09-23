import NodeHandleType from "./NodeHandleType";

/**
 * A node input or output handle of a node.
 */
export interface NodeHandle {
	name: string;
	type: NodeHandleType;
}

/**
 * A map of node input or output handles of a node.
 */
export interface NodeHandles {
	[key: string]: NodeHandle;
}
