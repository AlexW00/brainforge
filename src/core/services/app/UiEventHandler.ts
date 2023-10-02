import { inject, singleton } from "tsyringe";
import { UiEventBus } from "../events/UiEventBus";
import {
	SETTINGS_RIBBON_ITEM,
	TEMPLATES_RIBBON_ITEM,
} from "../../static/ui/StockAppRibbonItems";
import { RouterService } from "./RouterService";
import { ModalService } from "./ModalService";
import {
	SettingsModalDefinition,
	SettingsModalProperties,
} from "../../../frontend/components/modals/SettingsModal";

/**
 * Service to handle UI events.
 */
@singleton()
export class UiEventHandler {
	constructor(
		@inject(UiEventBus) private readonly ui: UiEventBus,
		@inject(RouterService) private readonly router: RouterService,
		@inject(ModalService) private readonly modal: ModalService
	) {
		this.ui.on("ribbon-item-clicked", (e) =>
			this.onRibbonItemClicked(e.detail)
		);
	}

	private onRibbonItemClicked(data: { ribbonItemId: string }) {
		if (data.ribbonItemId === TEMPLATES_RIBBON_ITEM.id) {
			this.router.navigateTo("templates", {});
		} else if (data.ribbonItemId === SETTINGS_RIBBON_ITEM.id) {
			const props: SettingsModalProperties = {
				initialCategoryId: "general",
			};
			this.modal.openModal("settings", props);
		}
	}
}
