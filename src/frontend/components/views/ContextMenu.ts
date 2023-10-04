import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
	ContextMenuEntry,
	ContextMenuItem,
	ContextMenuGroup,
} from "../../../core/types/views/ContextMenuItem";

@customElement("context-menu")
export default class ContextMenuComponent extends LitElement {
	@property({ type: Array })
	entries: ContextMenuEntry[] = [];

	@property({ type: Number })
	offsetLeft = 0;

	@property({ type: Number })
	offsetTop = 0;

	static styles = css`
		.context-menu {
			position: absolute;
			background-color: white;
			border: var(--border-width-small) solid var(--border-color);
			z-index: 1000;
		}

		.context-menu-item,
		.context-menu-group-title {
			padding: 8px 12px;
			cursor: pointer;
		}

		.context-menu-item:hover {
			background-color: #f5f5f5;
		}

		.context-menu-group-title {
			font-weight: bold;
		}
		.context-menu-group-items {
			display: none;
			position: absolute;
			top: 0;
			left: 100%;
			border: var(--border-width-small) solid var(--border-color);
			background-color: white;
			white-space: nowrap;
		}

		.context-menu-group:hover .context-menu-group-items {
			display: block;
		}
	`;

	private removeOtherContextMenus() {
		const contextMenus = document.querySelectorAll("context-menu");
		contextMenus.forEach((contextMenu) => {
			if (contextMenu !== this) {
				contextMenu.remove();
			}
		});
	}

	private onClickDocument = (event: MouseEvent) => {
		if (event.target !== this) this.remove();
	};

	firstUpdated() {
		document.addEventListener("mousedown", this.onClickDocument);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this.onClickDocument);
	}

	render() {
		this.removeOtherContextMenus();
		return html`
			<div class="context-menu">
				${this.entries.map((entry) => this.renderEntry(entry))}
			</div>
		`;
	}

	private updatePosition() {
		if (this.offsetLeft && this.offsetTop) {
			const contextMenu = this.shadowRoot?.querySelector(".context-menu");
			if (contextMenu) {
				contextMenu.setAttribute(
					"style",
					`left: ${this.offsetLeft}px; top: ${this.offsetTop}px;`
				);
			}
		}
	}

	protected updated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		if (
			_changedProperties.has("offsetLeft") ||
			_changedProperties.has("offsetTop")
		) {
			this.updatePosition();
		}
	}

	renderEntry(entry: ContextMenuEntry) {
		if ("onClick" in entry) {
			return this.renderItem(entry);
		} else {
			return this.renderGroup(entry);
		}
	}

	renderItem(item: ContextMenuItem) {
		return html`
			<div
				class="context-menu-item"
				@click="${() =>
					item.onClick({
						x: this.offsetLeft,
						y: this.offsetTop,
					})}"
			>
				${item.title}
			</div>
		`;
	}

	renderGroup(group: ContextMenuGroup) {
		return html`
			<div class="context-menu-group">
				<div class="context-menu-group-title">${group.title}</div>
				<div class="context-menu-group-items">
					${group.items.map((item) => this.renderItem(item))}
				</div>
			</div>
		`;
	}
}
