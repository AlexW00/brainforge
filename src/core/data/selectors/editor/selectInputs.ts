import { CustomNodeData } from "src/classes/nodes/CustomNodeData";
import { Inputs } from "../../../classes/nodes/outputs/Inputs";

import { Node } from "react-flow-renderer";

export const selectInputs = (
  node: Node<CustomNodeData>
): Inputs | undefined => {
  return node?.data?.inputs;
};
