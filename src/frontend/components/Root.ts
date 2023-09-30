import { CustomElement } from "./atomic/CustomElement";
import { css, html } from "lit";
import { container } from "tsyringe";
import { MasterService } from "../../core/services/MasterService";
import { Task, TaskStatus } from "@lit-labs/task";
import { choose } from "lit/directives/choose.js";
import { customElement } from "lit/decorators.js";

@customElement("root-component")
export default class RootComponent extends CustomElement {
	private masterService = container.resolve(MasterService);

	private initMasterServiceTask = new Task(
		this,
		async ([masterService]) => await masterService.init(),
		() => [this.masterService]
	);

	render() {
		return html`
			${choose(this.initMasterServiceTask.status, [
				[TaskStatus.PENDING, () => html`<load-root></load-root>`],
				[
					TaskStatus.ERROR,
					() =>
						html`<load-root
							error=${JSON.stringify(this.initMasterServiceTask.error)}
						></load-root>`,
				],
				[TaskStatus.COMPLETE, () => html`<app-root></app-root>`],
			])}
		`;
	}
}
