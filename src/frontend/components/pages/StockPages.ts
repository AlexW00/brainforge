import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { DeckPageDefinition } from "./DeckPage";
import { TemplatePageDefinition } from "./TemplatePage";

export const STOCK_PAGES: PageDefinition<any>[] = [
	new DeckPageDefinition(),
	new TemplatePageDefinition(),
];
