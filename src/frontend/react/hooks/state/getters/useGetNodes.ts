import { useStore } from "zustand";
import { TemplateNode } from "../../../../../core/data/models/flashcards/template/graph/TemplateNode";
import { useZustand } from "../../context/useZustand";

export const useGetNodes = (): TemplateNode[] => {
	return useStore(useZustand(), (state) => state.getNodes)();
};
