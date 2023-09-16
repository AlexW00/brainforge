import { CSSResultGroup, LitElement } from "lit-element";
import { customCss } from "../../styles/custom-css";
import { globalCss } from "../../styles/global-css";
import { resetCSS } from "../../styles/reset-css";
/**
 * Base class for all components.
 * Automatically includes global styles and resets.
 */
export abstract class EucideElement extends LitElement {
	// Small hack to include global styles

	private static _styles: CSSResultGroup;

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
}
