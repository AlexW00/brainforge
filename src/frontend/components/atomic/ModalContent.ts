import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "./CustomElement";
import { css, html } from "lit";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import type { ViewProperties } from "../../../core/types/views/ViewDefinition";

@customElement("modal-content")
export default class ModalContent extends CustomElement {
	@property({ type: Object })
	private properties?: ViewProperties;

	@property({ type: Object })
	private modal!: ModalDefinition<any>;

	constructor() {
		super();
		this.classList.add("container");
	}

	onclick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	closeModal = () => {
		this.dispatchEvent(new CustomEvent("close-modal"));
	};

	render() {
		return html`<div class="container"></div>`;
	}

	firstUpdated() {
		const container: HTMLElement =
			this.shadowRoot!.querySelector(".container")!;
		this.modal.onLoad(this.properties, container);
		this.modal.once("close", this.closeModal);

		if (!this.modal.doShowBackground) {
			this.style.background = "transparent";
			this.style.borderRadius = "0";
			this.style.padding = "0";
		}
	}

	static styles = css`
		:host {
			width: "wrap-content";
			height: "wrap-content";
			background: var(--bg-color);
			border-radius: var(--sl-border-radius-large);
			padding: 1rem;
			overflow-y: auto;
			overflow-x: hidden;

			max-width: 70%;
			max-height: 70%;
		}
	`;
}
