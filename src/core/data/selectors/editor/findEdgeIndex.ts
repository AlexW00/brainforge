import { Edge } from "react-flow-renderer";

export const findEdgeIndex = (id: string, edges: Edge[]): number => {
  return edges.findIndex((e) => e.id === id);
};
