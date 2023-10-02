import NodeHandleType from "src/classes/nodes/definition/io/handles/types/NodeHandleType";
import { selectFlow } from "src/data/selectors/app/selectFlow";
import { selectNode } from "src/data/selectors/editor/selectNode";
import { selectNodeHandles } from "src/data/selectors/editor/selectNodeHandles";
import AppModel from "../../models/AppModel";
import { setNodeHandle } from "./setNodeHandle";

export const setNodeHandleType = (
  isInput: boolean,
  name: string,
  type: NodeHandleType,
  nodeId: string,
  flowName: string,
  appModel: AppModel
): void => {
  const flow = selectFlow(flowName, appModel).editorModel,
    node = selectNode(nodeId, flow.nodes),
    handles = selectNodeHandles(isInput, node),
    handle = handles[name];
  setNodeHandle(
    isInput,
    name,
    Object.assign({}, handle, { type }),
    nodeId,
    flowName,
    appModel
  );
};
