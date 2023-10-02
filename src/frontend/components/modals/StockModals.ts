import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import { DebugModalDefinition } from "./DebugModal";
import { SettingsModalDefinition } from "./SettingsModal";

const PROD_MODALS: ModalDefinition<any>[] = [new SettingsModalDefinition()];

const DEBUG_MODALS: ModalDefinition<any>[] = [new DebugModalDefinition()];

const isProd = process.env.NODE_ENV === "production";

export const STOCK_MODALS = isProd
	? PROD_MODALS
	: [...PROD_MODALS, ...DEBUG_MODALS];
