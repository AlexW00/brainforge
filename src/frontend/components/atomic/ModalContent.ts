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
	}

	static styles = css`
		:host {
			width: 50%;
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
