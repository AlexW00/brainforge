import { NodeHandle } from "../../../classes/nodes/definition/io/handles/NodeHandle";
import { areCompatible } from "../../../classes/nodes/definition/io/handles/types/NodeHandleType";
import EditorModel from "../../models/EditorModel";
import { selectNode } from "../../selectors/editor/selectNode";

export const removeIncompatibleEdges = (
  isInput: boolean,
  handleName: string,
  handle: NodeHandle,
  nodeId: string,
  editorModel: EditorModel
): void => {
  // validate and remove invalid edges
  const edges = editorModel.edges.filter(
    // select all edges which:
    (edge) =>
      // are connected to this node
      (isInput ? edge.target : edge.source === nodeId) &&
      // and to this handle
      (isInput ? edge.targetHandle : edge.sourceHandle) === handleName
  );

  edges.forEach((edge) => {
    // get the connected node
    const node = selectNode(
      isInput ? edge.source : edge.target,
      editorModel.nodes
    );
    // select either the input or output handles
    const io = isInput
      ? node?.data?.definition?.io?.inputs
      : node?.data?.definition?.io?.outputs;
    // select the relevant handle
    const connectedHandle = io?.[handleName];

    // if the handle has an incompatible type now,
    if (connectedHandle && !areCompatible(handle, connectedHandle)) {
      // remove the edge
      editorModel.edges = editorModel.edges.filter((e) => e.id !== edge.id);
    }
  });
};
