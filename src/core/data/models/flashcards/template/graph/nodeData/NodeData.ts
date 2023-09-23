import { NodeIO } from "./io/NodeIO";

/**
 * NodeData holds the data of a node in a templatee.
 */
export interface NodeData {
	definitionId: string;
	io: NodeIO;
	doReRunOnRender: boolean;
}
