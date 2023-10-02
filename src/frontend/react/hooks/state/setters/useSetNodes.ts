import { TemplateNode } from "../../../../../core/data/models/flashcards/template/graph/TemplateNode";
import { Setter } from "../../../../../core/types/general/Setter";
import { useZustand } from "../../context/useZustand";

export const useSetNodes = (): Setter<TemplateNode[]> => {
	const setter = (nodes: TemplateNode[]) => {
		useZustand().getState().setNodes(nodes);
	};
	return setter;
};
