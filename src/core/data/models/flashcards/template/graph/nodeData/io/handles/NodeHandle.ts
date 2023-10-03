import NodeHandleType from "./NodeHandleType";

/**
 * A node input or output handle of a node.
 */
export interface NodeHandle {
	name: string;
	type: NodeHandleType;
}

export interface NodeInputHandle extends NodeHandle {}

/**
 * A function that returns the value of a node output handle.
 * @param inputValues The values of the input handles of the node.
 * @returns The value of the node output handle.
 */
export type NodeOutputHandleValueFunction = (
	inputValues: { name: string; value: any }[]
) => Promise<any>;

export type NodeOutputHandleValue = {
	get: NodeOutputHandleValueFunction;
	timestamp: Date;
};

export interface NodeOutputHandle extends NodeHandle {
	value: NodeOutputHandleValue;
}

/**
 * A map of node input or output handles of a node.
 */
export interface NodeHandles<T extends NodeHandle> {
	[key: string]: T;
}
