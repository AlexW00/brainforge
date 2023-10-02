import { CustomNodeData } from "src/classes/nodes/CustomNodeData";
import { NodeHandles } from "../../../classes/nodes/definition/io/handles/NodeHandles";

import { Node } from "react-flow-renderer";

export const selectNodeHandles = (
  isInput: boolean,
  node: Node<CustomNodeData>
): NodeHandles => {
  const definition = node?.data?.definition;
  const handles = isInput ? definition?.io?.inputs : definition?.io?.outputs;
  return handles;
};
