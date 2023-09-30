import { css } from "lit";
import { CustomElement } from "../atomic/CustomElement";
import { customElement } from "lit/decorators.js";

@customElement("panel-element")
export default abstract class Panel extends CustomElement {
	constructor() {
		super();
		this.classList.add("panel");
	}

	static styles = css`
		:host {
			overflow: hidden;
		}
	`;
}
