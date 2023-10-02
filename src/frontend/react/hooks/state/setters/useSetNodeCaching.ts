import { Setter } from "../../../../../core/types/general/Setter";
import { useNodeId } from "../../context/useNodeId";
import { useZustand } from "../../context/useZustand";

export const useSetNodeCaching = (): Setter<boolean> => {
	const nodeId = useNodeId(),
		setter = (doCache: boolean) =>
			useZustand().getState().setNodeCaching(nodeId, doCache);
	return setter;
};
