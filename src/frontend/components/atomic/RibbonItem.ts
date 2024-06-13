import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "./CustomElement.js";
import type { RibbonItem as RibbonItemModel } from "../../../core/types/views/RibbonItem.js";
import { css, html } from "lit";
import { UiEventBus } from "../../../core/services/events/UiEventBus.js";
import { container } from "tsyringe";

@customElement("ribbon-item")
export default class RibbonItem extends CustomElement {
	private uiEventBus = container.resolve(UiEventBus);

	@property({
		type: Object,
	})
	model: RibbonItemModel;

	onclick = () => {
		this.uiEventBus.emit("ribbon-item-clicked", {
			ribbonItemId: this.model.id,
		});
	};

	render() {
		return html`<div class="text">${this.model.title}</div>`;
	}

	// text rotated by -90deg
	static styles = css`
		:host {
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.text {
			writing-mode: vertical-lr;
			transform: rotate(180deg);

			cursor: pointer;
			color: var(--app-ribbon-item-color);
			user-select: none;
			font-size: var(--sl-font-size-large);
		}

		.text:hover {
			text-decoration: underline;
		}
	`;
}
