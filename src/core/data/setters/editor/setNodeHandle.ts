import { NodeHandle } from "src/classes/nodes/definition/io/handles/NodeHandle";
import AppModel from "../../models/AppModel";
import { selectFlow } from "../../selectors/app/selectFlow";
import { selectNode } from "../../selectors/editor/selectNode";
import { removeIncompatibleEdges } from "./removeIncompatibleEdges";

export const setNodeHandle = (
  isInput: boolean,
  name: string,
  handle: NodeHandle,
  nodeId: string,
  flowName: string,
  appModel: AppModel
): void => {
  const editorModel = selectFlow(flowName, appModel).editorModel;
  const node = selectNode(nodeId, editorModel.nodes);
  const io = node?.data?.definition?.io;
  const handles = isInput ? io?.inputs : io?.outputs;
  if (handles) handles[name] = handle;

  removeIncompatibleEdges(isInput, name, handle, nodeId, editorModel);
};
