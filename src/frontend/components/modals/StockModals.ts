import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { CardCreatorModalDefinition } from "./CardCreatorModal";
import { DebugModalDefinition } from "./DebugModal";
import { SettingsModalDefinition } from "./SettingsModal";

const PROD_MODALS: ModalDefinition<any>[] = [
	new SettingsModalDefinition(),
	new CardCreatorModalDefinition(),
];

const DEBUG_MODALS: ModalDefinition<any>[] = [new DebugModalDefinition()];

const isProd = process.env.NODE_ENV === "production";

export const STOCK_MODALS = isProd
	? PROD_MODALS
	: [...PROD_MODALS, ...DEBUG_MODALS];
