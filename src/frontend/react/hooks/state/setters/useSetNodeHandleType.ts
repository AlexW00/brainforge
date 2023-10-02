import NodeHandleType from "../../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandleType";
import { Setter } from "../../../../../core/types/general/Setter";
import { useZustand } from "../../context/useZustand";

export const useSetNodeHandleType = (
	isInput: boolean,
	name: string,
	nodeId: string
): Setter<NodeHandleType> => {
	const setter = (type: NodeHandleType) => {
		useZustand().getState().setNodeHandleType(nodeId, isInput, name, type);
	};
	return setter;
};
