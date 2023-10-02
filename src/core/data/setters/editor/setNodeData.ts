import { selectFlow } from "src/data/selectors/app/selectFlow";
import { selectNode } from "src/data/selectors/editor/selectNode";
import AppModel from "../../models/AppModel";

export const setNodeData = (
  data: any,
  nodeId: string,
  flowName: string,
  appModel: AppModel
): void => {
  const editorModel = selectFlow(flowName, appModel).editorModel;
  const node = selectNode(nodeId, editorModel.nodes);
  node.data.data = data;
};
