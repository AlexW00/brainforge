import { inject, singleton } from "tsyringe";
import { SettingsModalProperties } from "../../../frontend/components/modals/SettingsModal";
import {
	SETTINGS_RIBBON_ITEM,
	TEMPLATES_RIBBON_ITEM,
} from "../../static/ui/StockAppRibbonItems";
import { UiEventBus } from "../events/UiEventBus";
import { ModalService } from "./ModalService";
import { RouterService } from "./RouterService";

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

		window.addEventListener("keydown", (e) => {
			// ? button
			if (e.key === "!") {
				this.modal.openModal("debug", {});
			}

			console.log("Key pressed ui event", e.key);
		});
	}

	private onRibbonItemClicked(data: { ribbonItemId: string }) {
		if (data.ribbonItemId === TEMPLATES_RIBBON_ITEM.id) {
			console.log("Navigating to templates");
			this.router.navigateTo("template-overview-page", {});
		} else if (data.ribbonItemId === SETTINGS_RIBBON_ITEM.id) {
			const props: SettingsModalProperties = {
				initialCategoryId: "general",
			};
			this.modal.openModal("settings", props);
		}
	}
}
