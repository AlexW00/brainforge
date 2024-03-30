import { Task, TaskStatus } from "@lit/task";
import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { choose } from "lit/directives/choose.js";
import { container } from "tsyringe";
import { MasterService } from "../../core/services/MasterService";
import { CustomElement } from "./atomic/CustomElement";

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
