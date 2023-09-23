import { customElement } from "lit/decorators.js";
import { CustomElement } from "./elements/CustomElement";
import { html } from "lit";

@customElement("app-root")
export default class AppRoot extends CustomElement {
	render() {
		return html`
			<card-element> Hey there! This is a card component. </card-element>
		`;
	}
}
