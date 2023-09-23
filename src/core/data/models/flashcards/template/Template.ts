import { TemplateGraph } from "./graph/TemplateGraph";

/**
 * A graph-based Template. Can be used to render a flashcard from input data.
 */
export interface Template {
	id: string;
	graph: TemplateGraph;
}
