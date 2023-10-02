import { Edge } from "react-flow-renderer";
import EditorModel from "../../models/EditorModel";
import { selectNode } from "../../selectors/editor/selectNode";

export const deleteEdge = (edge: Edge, editorModel: EditorModel): void => {
  const index = editorModel.edges.findIndex((e) => e.id === edge.id);
  if (index !== -1) {
    editorModel.edges.splice(index, 1);

    if (edge.targetHandle) {
      // update the input of the target node
      const targetNode = selectNode(edge.target, editorModel.nodes);

      const alternativeEdges = editorModel.edges.filter(
        (e) => e.target === edge.target && e.targetHandle === edge.targetHandle
      );
      // if there are no more edges connected to this handle, set the input to null
      if (targetNode && alternativeEdges.length === 0) {
        targetNode.data.inputs[edge.targetHandle] = undefined;
      } else {
        // otherwise, set the input to the output of the first edge
        const connectedNode = selectNode(
          alternativeEdges[0].source,
          editorModel?.nodes
        );
        const connectedHandle =
          connectedNode?.data?.definition?.io?.outputs[edge.sourceHandle];
        if (targetNode && connectedHandle)
          targetNode.data.inputs[edge.targetHandle] = connectedHandle;
      }
    }
  }
};
