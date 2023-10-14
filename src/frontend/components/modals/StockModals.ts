import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import {
	CardCreatorModalDefinition,
	CardCreatorModalDefintitionBundle,
} from "./CardCreatorModal";
import { DebugModalDefinition, DebugModalDefinitionBundle } from "./DebugModal";
import {
	SettingsModalDefinition,
	SettingsModalDefinitionBundle,
} from "./SettingsModal";

const PROD_MODALS: IdentifiableConstructor<ModalDefinition<any>, Metadata>[] = [
	SettingsModalDefinitionBundle,
	CardCreatorModalDefintitionBundle,
];

const DEBUG_MODALS: IdentifiableConstructor<ModalDefinition<any>, Metadata>[] =
	[DebugModalDefinitionBundle];

const isProd = process.env.NODE_ENV === "production";

export const STOCK_MODALS = isProd
	? PROD_MODALS
	: [...PROD_MODALS, ...DEBUG_MODALS];
