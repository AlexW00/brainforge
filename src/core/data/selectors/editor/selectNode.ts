import { TemplateNode } from "../../models/flashcards/template/graph/TemplateNode";

export const selectNode = (
	id: string,
	nodes: TemplateNode[]
): TemplateNode | undefined => {
	return nodes.find((n) => n.id === id);
};
