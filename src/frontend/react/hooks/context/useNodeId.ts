import { useContext } from "react";
import { NodeIdContext } from "../../contexts/NodeIdContext";

export const useNodeId = (): string => {
	const nodeId = useContext(NodeIdContext);
	return nodeId;
};
