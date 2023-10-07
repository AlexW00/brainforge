import { CSSResultGroup, LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
	ContextMenuEntry,
	ContextMenuItem,
	ContextMenuGroup,
} from "../../../core/types/views/ContextMenuItem";

@customElement("context-menu")
export default class ContextMenuComponent extends LitElement {
	static KEY_SEPARATOR = ".*.";

	@property({ type: Array })
	entries: ContextMenuEntry[] = [];

	@property({ type: Number })
	offsetLeft = 0;

	@property({ type: Number })
	offsetTop = 0;

	isClosing = false;

	private removeOtherContextMenus() {
		const contextMenus = document.querySelectorAll("context-menu");
		contextMenus.forEach((contextMenu) => {
			if (contextMenu !== this) this.onClose();
		});
	}

	private onClickDocument = (event: MouseEvent) => {
		if (event.target !== this) this.onClose();
	};

	firstUpdated() {
		document.addEventListener("click", this.onClickDocument);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this.onClickDocument);
	}
	private onSelect(event: CustomEvent) {
		const menuItem = this.getMenuItem(event.detail.item.value);
		if (!menuItem) return;
		if (!("onClick" in menuItem)) return;
		this.onClose(menuItem);
	}

	private onClose(clickedMenuItem?: ContextMenuItem) {
		if (this.isClosing) return;
		this.isClosing = true;
		clickedMenuItem?.onClick({ x: this.offsetLeft, y: this.offsetTop });
		this.remove();
	}

	render() {
		this.removeOtherContextMenus();
		return html`
			<sl-menu
				class="context-menu"
				style="left: ${this.offsetLeft}px; top: ${this.offsetTop}px;"
				@sl-select=${this.onSelect}
			>
				${this.entries.map((entry) => this.renderEntry(entry))}
			</sl-menu>
		`;
	}

	renderEntry(entry: ContextMenuEntry) {
		if ("onClick" in entry) {
			return this.renderItem(entry);
		} else {
			return this.renderGroup(entry, entry.title);
		}
	}

	private getKey(id: string, title: string) {
		return `${id}${ContextMenuComponent.KEY_SEPARATOR}${title}`;
	}

	private getMenuItem(
		key: string,
		contextMenu = this.entries
	): undefined | ContextMenuEntry {
		if (!contextMenu) return undefined;
		if (key === "") return undefined;

		const keypath = key.split(ContextMenuComponent.KEY_SEPARATOR);
		if (keypath.length === 1) {
			return contextMenu.find((entry) => entry.title === keypath[0]);
		} else {
			const group = contextMenu.find(
				(entry) => entry.title === keypath[0]
			) as ContextMenuGroup;
			if (!group) return undefined;
			return this.getMenuItem(
				keypath.slice(1).join(ContextMenuComponent.KEY_SEPARATOR),
				group.items
			);
		}
	}

	renderItem(item: ContextMenuItem, id: string = "") {
		return html` <sl-menu-item value="${id}"> ${item.title} </sl-menu-item> `;
	}

	renderGroup(group: ContextMenuGroup, id: string) {
		return html`
			<sl-menu-item>
				${group.title}
				<sl-menu slot="submenu">
					${group.items.map((item) =>
						this.renderItem(item, this.getKey(id, item.title))
					)}
				</sl-menu>
			</sl-menu-item>
		`;
	}

	static styles = css`
		:host {
			position: absolute;
			z-index: 100;
		}
		sl-menu {
			max-width: 20rem;
		}
	`;
}
