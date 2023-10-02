import { CustomNodeDefinition } from "src/classes/nodes/definition/NodeDefinition";
import AppModel from "../../models/AppModel";
import { selectFlow } from "../../selectors/app/selectFlow";
import { selectNode } from "../../selectors/editor/selectNode";

export const setNodeDefinition = (
  definition: CustomNodeDefinition,
  nodeId: string,
  flowName: string,
  appModel: AppModel
): void => {
  // update outputs
  const editorModel = selectFlow(flowName, appModel).editorModel;
  const node = selectNode(nodeId, editorModel.nodes);

  node.data.definition = definition;
};
