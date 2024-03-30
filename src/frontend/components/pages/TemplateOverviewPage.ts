import { Task } from "@lit/task";
import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { container } from "tsyringe";
import { Template } from "../../../core/data/models/flashcards/template/Template";
import { RouterService } from "../../../core/services/app/RouterService";
import { PouchTemplateService } from "../../../core/services/storage/pouch/docs/multi/PouchTemplateService";
import { IdentifiableConstructor } from "../../../core/types/general/Constructor";
import { Metadata } from "../../../core/types/general/Metadata";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { CustomElement } from "../atomic/CustomElement";

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
		this.router.navigateTo("template-editor-page", {
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

const TEMPLATE_PAGE_METADATA: Metadata = {
	id: "template-overview-page",
	name: "Templates",
	description: "A page that displays all templates",
};

export class TemplateOverviewPageDefinition extends PageDefinition<TemplatePageProperties> {
	id = TEMPLATE_PAGE_METADATA.id;
	name = TEMPLATE_PAGE_METADATA.name;
	description = TEMPLATE_PAGE_METADATA.description;

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

export const TemplateOverviewPageDefintionBundle: IdentifiableConstructor<
	TemplateOverviewPageDefinition,
	Metadata
> = {
	constructor: TemplateOverviewPageDefinition,
	metadata: TEMPLATE_PAGE_METADATA,
};
