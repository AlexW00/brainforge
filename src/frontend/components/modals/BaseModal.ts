import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { css, html } from "lit";
import { ModalDefinition } from "../../../core/types/views/ModalDefinition";
import type { ViewProperties } from "../../../core/types/views/ViewDefinition";

@customElement("base-modal")
export default class BaseModal extends CustomElement {
	@property({ type: Object })
	public readonly modal!: ModalDefinition<any>;

	@property({ type: Object })
	public properties?: ViewProperties;

	constructor(modal: ModalDefinition<any>, properties?: ViewProperties) {
		super();
		if (!modal) throw new Error("Modal definition is required");
		this.modal = modal;
		this.properties = properties;
		this.classList.add("container");
	}

	closeModal = (doRemoveRoot = false) => {
		this.modal.onUnload();
		if (doRemoveRoot) {
			this.remove();
		}
	};

	onclick = (e: MouseEvent) => {
		e.stopPropagation();
		this.closeModal(true);
	};

	disconnectedCallback() {
		this.closeModal(false);
		super.disconnectedCallback();
	}

	render() {
		return html`<modal-content
			.modal=${this.modal}
			.properties=${this.properties}
			@close-modal=${() => this.closeModal(true)}
		>
		</modal-content> `;
	}

	static styles = css`
		:host {
			position: absolute;
			width: 100%;
			height: 100%;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			background: var(--dimmed-bg-color);
			z-index: 10001;
		}
	`;
}
