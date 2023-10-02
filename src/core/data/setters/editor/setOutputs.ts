import { Outputs } from "src/classes/nodes/outputs/Outputs";
import AppModel from "../../models/AppModel";
import { selectFlow } from "../../selectors/app/selectFlow";
import { selectConnectedNodes } from "../../selectors/editor/selectConnectedNodes";
import { selectNode } from "../../selectors/editor/selectNode";

export const setOutputs = (
  outputs: Outputs,
  nodeId: string,
  flowName: string,
  appModel: AppModel
): void => {
  // update outputs
  const editorModel = selectFlow(flowName, appModel).editorModel;
  const node = selectNode(nodeId, editorModel.nodes);
  if (node) node.data.outputs = outputs;

  // update inputs
  Object.keys(outputs).forEach((outputId) => {
    const connectedNodes = selectConnectedNodes(
      nodeId,
      false,
      outputId,
      editorModel.edges,
      editorModel.nodes
    );
    const output = outputs[outputId];

    connectedNodes.forEach((connectedNode) => {
      connectedNode.node.data.inputs[connectedNode.connectedOn] = output;
    });
  });
};
