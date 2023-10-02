import { Edge } from "react-flow-renderer";
import EditorModel from "../../models/EditorModel";
import { selectNode } from "../../selectors/editor/selectNode";

export const addEdge = (edge: Edge, editorModel: EditorModel): void => {
  editorModel.edges = editorModel.edges.filter((e) => e.id !== edge.id);
  editorModel.edges = [...editorModel.edges, edge];

  if (edge.targetHandle && edge.sourceHandle) {
    const targetNode = selectNode(edge.target, editorModel.nodes),
      sourceNode = selectNode(edge.source, editorModel.nodes);
    if (sourceNode && targetNode) {
      targetNode.data.inputs[edge.targetHandle] =
        sourceNode.data.outputs[edge.sourceHandle];
    }
  }
};
