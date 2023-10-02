import { Node } from "react-flow-renderer";
import { CustomNodeData } from "src/classes/nodes/CustomNodeData";
import { OutputData } from "../../../classes/nodes/outputs/Outputs";
import { selectOutputs } from "./selectOutputs";

export const selectOutput = (
  outputId: string,
  node: Node<CustomNodeData>
): OutputData | undefined => {
  return selectOutputs(node)[outputId];
};
