import { CustomNodeData } from "src/classes/nodes/CustomNodeData";
import { Node } from "react-flow-renderer";

import EditorModel from "src/data/models/EditorModel";

export const setNodes = (
  newNodes: Node<CustomNodeData>[],
  editorModel: EditorModel
): void => {
  editorModel.nodes = newNodes;
};
