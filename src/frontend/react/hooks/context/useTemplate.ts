import { useContext } from "react";
import { TemplateContext } from "../../contexts/TemplateContext";
import { Template } from "../../../../core/data/models/flashcards/template/Template";

export const useTemplate = (): Template => {
	return useContext(TemplateContext);
};
