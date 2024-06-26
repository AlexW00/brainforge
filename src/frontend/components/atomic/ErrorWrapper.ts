import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";

@customElement("error-wrapper")
export default class ErrorWrapper extends CustomElement {
	@property({ type: String })
	message: string = "An error occurred";

	reload = (e: MouseEvent) => {
		this.dispatchEvent(new CustomEvent("reload"));
		e.stopPropagation();
	};

	render() {
		return html`
			<div class="message">
				<sl-icon library="ph-regular" name="warning"></sl-icon>
				${this.message}
			</div>
			<div id="retry-button">
				<sl-button variant="danger" @click=${this.reload}>
					<sl-icon
						slot="suffix"
						library="ph-regular"
						name="arrow-clockwise"
					></sl-icon>
					Reload</sl-button
				>
			</div>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.message {
			display: flex;
			align-items: center;
			width: 100%;
		}

		.retry-button {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
	`;
}
