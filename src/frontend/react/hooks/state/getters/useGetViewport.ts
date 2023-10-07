import { useStore } from "zustand";
import { TemplateNode } from "../../../../../core/data/models/flashcards/template/graph/TemplateNode";
import { useZustand } from "../../context/useZustand";
import { Viewport } from "reactflow";

export const useGetViewport = (): Viewport => {
	return useStore(useZustand(), (state) => state.getViewport)();
};
