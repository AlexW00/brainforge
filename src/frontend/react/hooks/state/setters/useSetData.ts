import { NodeData } from "../../../../../core/data/models/flashcards/template/graph/nodeData/NodeData";
import { Setter } from "../../../../../core/types/general/Setter";
import { useNodeId } from "../../context/useNodeId";
import { useZustand } from "../../context/useZustand";

export const useSetData = (): Setter<NodeData> => {
	const nodeId = useNodeId(),
		setter = (data: any) => useZustand().getState().setNodeData(nodeId, data);
	return setter;
};
