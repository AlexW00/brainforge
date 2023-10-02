import { Node } from "react-flow-renderer";

export const findNodeIndex = (id: string, nodes: Node[]): number => {
  return nodes.findIndex((n) => n.id === id);
};
