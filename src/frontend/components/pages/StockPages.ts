import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { DeckPageDefinitionBundle } from "./DeckPage";
import { ReviewPageDefinitionBundle } from "./ReviewPage";
import { TemplateEditorPageDefinitionBundle } from "./TemplateEditorPage";
import { TemplateOverviewPageDefintionBundle } from "./TemplateOverviewPage";

export const STOCK_PAGES: IdentifiableConstructor<any, any>[] = [
	DeckPageDefinitionBundle,
	TemplateOverviewPageDefintionBundle,
	TemplateEditorPageDefinitionBundle,
	ReviewPageDefinitionBundle,
];
