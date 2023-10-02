import { CustomNodeData } from "src/classes/nodes/CustomNodeData";
import { Edge, Node } from "react-flow-renderer";
import { selectNode } from "./selectNode";

export const selectConnectedNodes = (
  id: string,
  isTarget: boolean,
  handleId: string,
  edges: Edge[],
  nodes: Node<CustomNodeData>[]
): { node: Node<CustomNodeData>; connectedOn: string }[] => {
  return (
    edges
      // find all edges connected to the handle
      .filter((e) =>
        isTarget
          ? e.target === id && e.targetHandle === handleId
          : e.source === id && e.sourceHandle === handleId
      )
      // get the nodes connected to the edges
      .map((e) => {
        return {
          node: selectNode(isTarget ? e.source : e.target, nodes),
          connectedOn: isTarget ? e.sourceHandle : e.targetHandle,
        };
      })
      // filter out undefined nodes
      .filter((r) => r.node !== undefined)
  );
};
