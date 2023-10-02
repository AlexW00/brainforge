import { Node } from "react-flow-renderer";
import { CustomNodeData } from "src/classes/nodes/CustomNodeData";
import { OutputData } from "src/classes/nodes/outputs/Outputs";

import { selectInputs } from "./selectInputs";

export const selectInput = (
  inputId: string,
  node: Node<CustomNodeData>
): OutputData | undefined => {
  return selectInputs(node)[inputId];
};
