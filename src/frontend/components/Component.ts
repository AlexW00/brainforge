import { CSSResultGroup, LitElement } from "lit";
import { resetCSS } from "../styles/reset.css.ts";
import { customCss } from "../styles/custom.css.ts";

/**
 * Base class for all components.
 * Automatically includes global styles and resets.
 */
export abstract class Component extends LitElement {
	// Small hack to include global styles

	private static _styles: CSSResultGroup;

	static get styles(): CSSResultGroup {
		const derivedStyles = this._styles || [];
		return [
			resetCSS,
			customCss,
			...(Array.isArray(derivedStyles) ? derivedStyles : [derivedStyles]),
		];
	}

	static set styles(styles: CSSResultGroup) {
		this._styles = styles;
	}
}
