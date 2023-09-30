import { customElement, state } from "lit/decorators.js";
import Panel from "./Panel";
import { css, html } from "lit";
import { container } from "tsyringe";
import { RouterService } from "../../../core/services/app/RouterService";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { ElementRegistrarService } from "../../../core/services/app/ElementRegistrarService";

@customElement("page-panel")
export default class PagePanel extends Panel {
	private readonly router = container.resolve(RouterService);
	private readonly elementRegistrar = container.resolve(
		ElementRegistrarService
	);

	@state()
	page?: PageDefinition<any>;

	@state()
	properties?: any;

	setPageDefinition(pageId?: string) {
		if (!pageId) {
			this.page = undefined;
			return;
		}
		this.page = this.elementRegistrar.getPageDefinitionById(pageId);
	}

	firstUpdated() {
		this.router.on("lastStepChanged", (e) => {
			const [newStep, prevStep] = e.detail;
			if (newStep?.pageId !== prevStep?.pageId) {
				this.setPageDefinition(newStep?.pageId);
			}
			this.properties = newStep?.properties;
			console.log("new step", this.page, this.properties);
		});
	}

	render() {
		return html`
			<page-header .page=${this.page}></page-header>
			<page-content
				.page=${this.page}
				.properties=${this.properties}
			></page-content>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			flex-grow: 12;
			background: var(--bg-color);
		}
	`;
}
