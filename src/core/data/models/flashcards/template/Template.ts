import { Identifiable } from "../../../../types/general/Identifiable";
import { TemplateGraph } from "./graph/TemplateGraph";

/**
 * A graph-based Template. Can be used to render a flashcard from input data.
 */
export interface Template extends Identifiable {
	graph: TemplateGraph;
	name: string;
}
