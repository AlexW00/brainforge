import { TemplateEdge } from "./TemplateEdge";
import { TemplateNode } from "./TemplateNode";

/**
 * The graph definition of a Template.
 */
export interface TemplateGraph {
	edges: TemplateEdge[];
	nodes: TemplateNode[];
}
