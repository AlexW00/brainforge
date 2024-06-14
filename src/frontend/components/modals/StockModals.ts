import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CardCreatorModalDefintitionBundle } from "./CardCreatorModal";
import { CardEditorModalDefintitionBundle } from "./CardEditorModal";
import { CardViewerModalDefinitionBundle } from "./CardViewerModal";
import { DebugModalDefinitionBundle } from "./DebugModal";
import { SettingsModalDefinitionBundle } from "./SettingsModal";

const PROD_MODALS: IdentifiableConstructor<ModalDefinition<any>, Metadata>[] = [
	SettingsModalDefinitionBundle,
	CardCreatorModalDefintitionBundle,
	CardViewerModalDefinitionBundle,
	CardEditorModalDefintitionBundle,
];

const DEBUG_MODALS: IdentifiableConstructor<ModalDefinition<any>, Metadata>[] =
	[DebugModalDefinitionBundle];

const isProd = process.env.NODE_ENV === "production";

export const STOCK_MODALS = isProd
	? PROD_MODALS
	: [...PROD_MODALS, ...DEBUG_MODALS];
