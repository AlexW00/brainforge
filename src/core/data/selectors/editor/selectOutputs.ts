import { Node } from "react-flow-renderer";
import { CustomNodeData } from "src/classes/nodes/CustomNodeData";
import { Outputs } from "../../../classes/nodes/outputs/Outputs";

export const selectOutputs = (
  node: Node<CustomNodeData>
): Outputs | undefined => {
  return node?.data?.outputs;
};
