import { customElement } from "lit/decorators.js";
import { EucideElement } from "./elements/Component";
import { css, html } from "lit";

@customElement("app-root")
export default class AppRoot extends EucideElement {
	static styles = [
		css`
			:host {
				max-width: 1280px;
				margin: 0 auto;
				padding: 2rem;
				text-align: center;
			}
		`,
	];

	render() {
		return html`
			<h1>App Root</h1>
			<test-component></test-component>
		`;
	}
}
