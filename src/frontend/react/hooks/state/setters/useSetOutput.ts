import { NodeOutputHandleValueFunction } from "../../../../../core/data/models/flashcards/template/graph/nodeData/io/handles/NodeHandle";
import { Setter } from "../../../../../core/types/general/Setter";
import { useNodeId } from "../../context/useNodeId";
import { useZustand } from "../../context/useZustand";

export const useSetOutput = (): Setter<{
	value: NodeOutputHandleValueFunction;
	name: string;
}> => {
	const nodeId = useNodeId(),
		setter = (data: { value: NodeOutputHandleValueFunction; name: string }) =>
			useZustand().getState().setOutputData(nodeId, data.name, data.value);
	return setter;
};
