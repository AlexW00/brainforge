import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { DeckPageDefinition } from "./DeckPage";
import { TemplateEditorPageDefinition } from "./TemplateEditorPage";
import { TemplateOverviewPageDefinition } from "./TemplateOverviewPage";

export const STOCK_PAGES: PageDefinition<any>[] = [
	new DeckPageDefinition(),
	new TemplateOverviewPageDefinition(),
	new TemplateEditorPageDefinition(),
];
