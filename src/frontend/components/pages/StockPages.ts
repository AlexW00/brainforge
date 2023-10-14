import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { DeckPageDefinition, DeckPageDefinitionBundle } from "./DeckPage";
import {
	TemplateEditorPageDefinition,
	TemplateEditorPageDefinitionBundle,
} from "./TemplateEditorPage";
import {
	TemplateOverviewPageDefinition,
	TemplateOverviewPageDefintionBundle,
} from "./TemplateOverviewPage";

export const STOCK_PAGES: IdentifiableConstructor<any, any>[] = [
	DeckPageDefinitionBundle,
	TemplateOverviewPageDefintionBundle,
	TemplateEditorPageDefinitionBundle,
];
