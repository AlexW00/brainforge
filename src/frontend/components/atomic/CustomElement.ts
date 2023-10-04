import { CSSResultGroup, LitElement } from "lit-element";
import { customCss } from "../../styles/custom-css";
import { globalCss } from "../../styles/global-css";
import { resetCSS } from "../../styles/reset-css";
import { ViewStatus } from "../../../core/types/views/ViewState";
import { ContextMenu } from "../../../core/types/views/ContextMenuItem";
/**
 * Base class for all components.
 * Automatically includes global styles and resets.
 */
export abstract class CustomElement extends LitElement {
	// Small hack to include global styles

	private static _styles: CSSResultGroup;

	protected contextMenu?: ContextMenu;

	static get styles(): CSSResultGroup {
		const derivedStyles = this._styles || [];
		return [
			resetCSS,
			globalCss,
			...(Array.isArray(derivedStyles) ? derivedStyles : [derivedStyles]),
			customCss,
		];
	}

	static set styles(styles: CSSResultGroup) {
		this._styles = styles;
	}

	constructor() {
		super();
		// add class name of the extending class to the element as a class, split by camel case
		// e.g. CardElement -> card-element
		const className = this.constructor.name
			.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
			.toLowerCase();
		this.classList.add(className);
	}

	private getStatusClass(status: ViewStatus) {
		if (status === ViewStatus.INITIAL) return "initial";
		if (status === ViewStatus.PENDING) return "loading";
		if (status === ViewStatus.COMPLETE) return "loaded";
		return "error";
	}

	protected setStatus(staus: ViewStatus) {
		this.classList.remove("initial", "loading", "loaded", "error");
		this.classList.add(this.getStatusClass(staus));
	}

	private showContextMenu(x: number, y: number) {
		console.log("showing context menu", x, y, this.contextMenu);
	}

	oncontextmenu = (e: MouseEvent) => {
		if (this.contextMenu === undefined) return;
		e.preventDefault();
		this.showContextMenu(e.clientX, e.clientY);
	};
}
