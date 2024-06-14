import { NodeIO } from "./io/NodeIO";
import { DateString } from "../../../../../../types/general/DateString";

/**
 * NodeData holds the data of a node in a templatee.
 */
export interface NodeData {
	definitionId: string;
	io?: NodeIO;
	doReRunOnRender: boolean;
	lastEditTs?: DateString;
	data: any;
}
