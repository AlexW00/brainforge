import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import type { ViewProperties } from "../../../core/types/views/ViewDefinition";
import { CustomElement } from "./CustomElement";

@customElement("modal-content")
export default class ModalContent extends CustomElement {
	@property({ type: Object })
	private properties?: ViewProperties;

	@property({ type: Object })
	private modal!: ModalDefinition<any>;

	onclick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	closeModal = () => {
		this.dispatchEvent(new CustomEvent("close-modal"));
	};

	render() {
		return html`<div id="container"></div>`;
	}

	firstUpdated() {
		const container: HTMLElement =
			this.shadowRoot!.querySelector("#container")!;
		this.modal.onLoad(this.properties, container);
		this.modal.once("close", this.closeModal);

		if (!this.modal.doShowBackground) {
			this.style.background = "transparent";
			this.style.borderRadius = "0";
			this.style.padding = "0";
		}

		this.style.maxWidth = this.modal.maxWidth;
		this.style.maxHeight = this.modal.maxHeight;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			flex: 0 0 auto;

			background: var(--bg-color);
			border-radius: var(--sl-border-radius-large);
			padding: 1rem;
			overflow-y: hidden;
			overflow-x: hidden;
		}

		#container {
			flex: 1;
			overflow-y: hidden;
			display: flex;
		}
	`;
}
