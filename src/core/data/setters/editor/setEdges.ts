import { Edge } from "react-flow-renderer";
import EditorModel from "src/data/models/EditorModel";
import { addEdge } from "./addEdge";
import { deleteEdge } from "./deleteEdge";

export const setEdges = (edges: Edge[], editorModel: EditorModel): void => {
  // delete edges that are not in the new list
  editorModel.edges
    // find them
    ?.filter((oldEdge) => edges.every((newEdge) => newEdge.id !== oldEdge.id))
    // create delete actions
    .map((edgeToDelete) => () => deleteEdge(edgeToDelete, editorModel))
    // execute delete actions
    .forEach((deleteAction) => deleteAction());

  // add all new edges
  edges.forEach((edge) => addEdge(edge, editorModel));
};
