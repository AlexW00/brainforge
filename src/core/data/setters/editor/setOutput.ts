import { OutputData } from "src/classes/nodes/outputs/Outputs";
import AppModel from "../../models/AppModel";
import { selectFlow } from "../../selectors/app/selectFlow";
import { selectConnectedNodes } from "../../selectors/editor/selectConnectedNodes";
import { selectNode } from "../../selectors/editor/selectNode";

export const setOutput = (
  output: OutputData,
  id: string,
  nodeId: string,
  flowName: string,
  appModel: AppModel
): void => {
  // update outputs
  const editorModel = selectFlow(flowName, appModel).editorModel;
  const node = selectNode(nodeId, editorModel.nodes);
  if (node) node.data.outputs[id] = output;

  // update inputs
  const connectedNodes = selectConnectedNodes(
    nodeId,
    false,
    id,
    editorModel.edges,
    editorModel.nodes
  );

  connectedNodes.forEach((connectedNode) => {
    connectedNode.node.data.inputs[connectedNode.connectedOn] = output;
  });
};
