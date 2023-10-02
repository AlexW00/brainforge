import { Setter } from "../../../../../core/types/general/Setter";
import { useNodeId } from "../../context/useNodeId";
import { useZustand } from "../../context/useZustand";

export const useSetDataData = (): Setter<any> => {
	const nodeId = useNodeId(),
		setter = (data: any) =>
			useZustand().getState().setNodeDataData(nodeId, data);
	return setter;
};
