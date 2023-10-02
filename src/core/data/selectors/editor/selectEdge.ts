import { Edge } from "react-flow-renderer";

export const selectEdge = (id: string, edges: Edge[]): Edge | undefined => {
  return edges.find((e) => e.id === id);
};
