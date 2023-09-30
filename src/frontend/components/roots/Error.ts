import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";

@customElement("error-root")
export default class ErrorRoot extends CustomElement {
	@property({ type: String })
	error: string = "";

	render() {
		return html` <div>LOAD ERROR: ${this.error}</div> `;
	}
}
