import { NodeHandles } from "src/classes/nodes/definition/io/handles/NodeHandles";
import { selectFlow } from "src/data/selectors/app/selectFlow";
import { selectNode } from "src/data/selectors/editor/selectNode";
import AppModel from "../../models/AppModel";

export const setNodeHandles = (
  isInput: boolean,
  handles: NodeHandles,
  nodeId: string,
  flowName: string,
  appModel: AppModel
): void => {
  const editorModel = selectFlow(flowName, appModel).editorModel;
  const node = selectNode(nodeId, editorModel.nodes);
  const io = node?.data?.definition?.io;
  if (io) {
    if (isInput) io.inputs = handles;
    else io.outputs = handles;
  }
};
