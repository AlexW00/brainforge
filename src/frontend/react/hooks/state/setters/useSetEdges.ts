import { TemplateEdge } from "../../../../../core/data/models/flashcards/template/graph/TemplateEdge";
import { Setter } from "../../../../../core/types/general/Setter";
import { useZustand } from "../../context/useZustand";

export const useSetEdges = (): Setter<TemplateEdge[]> => {
	const setter = (edges: TemplateEdge[]) => {
		useZustand().getState().setEdges(edges);
	};
	return setter;
};
