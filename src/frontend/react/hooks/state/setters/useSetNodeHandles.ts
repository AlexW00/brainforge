import {
	NodeHandle,
	NodeHandles,
} from "../../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { Setter } from "../../../../../core/types/general/Setter";
import { useNodeId } from "../../context/useNodeId";
import { useZustand } from "../../context/useZustand";

export const useSetNodeHandles = (
	isInput: boolean
): Setter<NodeHandles<any>> => {
	const nodeId = useNodeId(),
		setter = (handles: NodeHandles<any>) => {
			useZustand().getState().setNodeHandles(nodeId, isInput, handles);
		};
	return setter;
};
