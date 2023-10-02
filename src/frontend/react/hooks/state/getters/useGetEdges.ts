import { useStore } from "zustand";
import { TemplateEdge } from "../../../../../core/data/models/flashcards/template/graph/TemplateEdge";
import { useZustand } from "../../context/useZustand";

export const useGetEdges = (): TemplateEdge[] => {
	return useStore(useZustand(), (state) => state.getEdges)();
};
