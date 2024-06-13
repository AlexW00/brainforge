import { css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { container } from "tsyringe";
import { AppRibbonService } from "../../../core/services/app/AppRibbonService";
import { map } from "lit/directives/map.js";
import { RibbonItem } from "../../../core/types/views/RibbonItem";
import {
	SETTINGS_RIBBON_ITEM,
	TEMPLATES_RIBBON_ITEM,
} from "../../../core/static/ui/StockAppRibbonItems";

@customElement("app-ribbon")
export default class AppRibbon extends CustomElement {
	private ribbonService = container.resolve(AppRibbonService);

	@state()
	private items: RibbonItem[] = this.ribbonService.getItems();

	protected firstUpdated(_c: any): void {
		super.firstUpdated(_c);
		this.ribbonService.on("items-changed", (e) => (this.items = e.detail));
	}

	render() {
		return html`
			<div id="dynamic-items" class="item-container">
				${map(this.items, (item) => {
					return html`<ribbon-item .model=${item}></ribbon-item>`;
				})}
			</div>
			<spacer-component></spacer-component>
			<div id="static-items" class="item-container system">
				<ribbon-item .model=${TEMPLATES_RIBBON_ITEM}></ribbon-item>
				<ribbon-item .model=${SETTINGS_RIBBON_ITEM}></ribbon-item>
			</div>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			width: 2.5rem;
			min-width: 2.5rem;
			background: var(--behind-app-color);

			padding: 1.5rem 0.5rem 1.5rem 0.5rem;
		}
		.item-container {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		.item-container.system {
			gap: 1.5rem;
		}
	`;
}
