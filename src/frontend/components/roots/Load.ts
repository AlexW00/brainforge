import { html } from "lit";
import { CustomElement } from "../atomic/CustomElement";
import { customElement } from "lit/decorators.js";

@customElement("load-root")
export default class LoadRoot extends CustomElement {
	render() {
		return html` <div>Loading...</div> `;
	}
}
