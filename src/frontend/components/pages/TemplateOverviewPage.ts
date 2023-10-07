import { customElement, property, state } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { css, html } from "lit";
import { container } from "tsyringe";
import { Task } from "@lit-labs/task";
import { PouchTemplateService } from "../../../core/services/storage/pouch/docs/multi/PouchTemplateService";
import { Template } from "../../../core/data/models/flashcards/template/Template";
import { map } from "lit/directives/map.js";
import { produce } from "immer";
import { RouterService } from "../../../core/services/app/RouterService";

@customElement("template-overview-page")
export default class TemplateOverviewPage extends CustomElement {
	private readonly templateService = container.resolve(PouchTemplateService);
	private readonly router = container.resolve(RouterService);

	@property({ type: Object })
	properties!: TemplatePageProperties;

	@state()
	private templates: Template[] = [];

	private loadTemplatesTask = new Task(this, {
		task: async () => {
			const templates = await this.templateService.getAll();
			this.templates = templates;
		},
		autoRun: false,
	});

	private unregisterTemplateChangeListener: (() => void) | undefined;
	private onTemplateChanged = (e: CustomEvent<Template>) => {
		this.loadTemplatesTask.run();
	};

	connectedCallback() {
		this.templateService.on("change", this.onTemplateChanged);
		this.loadTemplatesTask.run();
		super.connectedCallback();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.templateService.off("change", this.onTemplateChanged);
	}

	onClickTemplate = (template: Template) => {
		console.log("Clicked template", template);
		this.router.navigateTo("template-editor", {
			templateId: template.id,
		});
	};

	render() {
		return html`
			<div id="template-grid">
				${map(
					this.templates,
					(template) => html`
						<template-thumbnail
							.template=${template}
							@click=${() => this.onClickTemplate(template)}
						></template-thumbnail>
					`
				)}
			</div>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			background: var(--bg-color);
			flex: 1;
		}
		#template-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
			grid-gap: 1rem;
			padding: 1rem;
		}
	`;
}

type TemplatePageProperties = {
	openTemplateId?: string;
};

export class TemplateOverviewPageDefinition extends PageDefinition<TemplatePageProperties> {
	id = "template-overview";
	name = "Templates";
	defaultInfo = "Templates";

	private templatePage: TemplateOverviewPage;
	private readonly templateService: PouchTemplateService =
		container.resolve(PouchTemplateService);

	onLoad = (properties: TemplatePageProperties, container: HTMLElement) => {
		this.templatePage = new TemplateOverviewPage();
		this.templatePage.properties = properties;
		container.appendChild(this.templatePage);
	};

	onUnload = () => {};
	onUpdate = (properties: TemplatePageProperties) => {
		this.templatePage.properties = properties;
	};

	getActions() {
		return [
			{
				id: "add-template",
				title: "Create",
				icon: "file-plus",
				onClick: () => {
					this.templateService.createNew();
				},
			},
		];
	}
}
