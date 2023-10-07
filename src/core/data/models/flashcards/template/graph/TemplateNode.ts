import { Node as ReactFlowNode } from "reactflow";
import { NodeData } from "./nodeData/NodeData";
import { Position } from "../../../../../types/general/Position";
import { v4 as uuidv4 } from "uuid";
export type TemplateNode = ReactFlowNode<NodeData>;

export const newTemplateNode = (
	definitionId: string,
	position: Position
): TemplateNode => ({
	position,
	id: uuidv4(),
	type: "custom",
	data: {
		definitionId,
		doReRunOnRender: false,
		data: {},
	},
});
