import { TaskStatus } from "@lit-labs/task";
import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { CustomElement } from "../atomic/CustomElement";

@customElement("loading-wrapper")
export default class LoadingWrapper extends CustomElement {
	@property({ type: Number })
	status: TaskStatus;

	@property({ type: String })
	errorMessage?: string;

	constructor() {
		super();
		this.classList.add("container");
	}

	private hasSlot = (name: string) => {
		return this.querySelector(`[slot=${name}]`) !== null;
	};

	private renderInitial = () => {
		console.log("STATUS INITIAL");
		if (!this.hasSlot("initial")) return html`Initial...`;
		return html`<slot name="initial"></slot>`;
	};

	private renderPending = () => {
		console.log("STATUS PENDING");
		if (!this.hasSlot("loading"))
			return html` <text-loading-skeleton></text-loading-skeleton> `;
		return html`<slot name="loading"></slot>`;
	};

	private renderComplete = () => {
		console.log("STATUS COMPLETE");
		if (!this.hasSlot("completed")) return html`Completed!`;
		return html`<slot name="completed"></slot>`;
	};

	private renderError = () => {
		console.log("STATUS ERROR");
		const errorMessage = this.errorMessage ?? "An error occurred";
		if (!this.hasSlot("error"))
			return html`<error-wrapper
				.message=${errorMessage as any}
				@reload=${() => this.dispatchEvent(new CustomEvent("reload"))}
			></error-wrapper>`;

		return html`<slot name="error"></slot>`;
	};

	render() {
		if (this.status === undefined) throw new Error("Taskstatus is undefined");

		return html`
			${choose(this.status, [
				[TaskStatus.INITIAL, this.renderInitial],
				[TaskStatus.PENDING, this.renderPending],
				[TaskStatus.COMPLETE, this.renderComplete],
				[TaskStatus.ERROR, this.renderError],
			])}
		`;
	}
}
