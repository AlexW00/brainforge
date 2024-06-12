import { customElement, state } from "lit/decorators.js";
import Panel from "./Panel";
import { css, html } from "lit";
import { container } from "tsyringe";
import { RouterService } from "../../../core/services/app/RouterService";
import { PageDefinition } from "../../../core/types/views/PageDefinition";
import { ElementRegistrarService } from "../../../core/services/app/ElementRegistrarService";
import { ifDefined } from "lit/directives/if-defined.js";
import { DEFAULT_DECK } from "../default/defaultDeck";

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

	@state()
	info?: string;

	private onInfoChanged = (e: CustomEvent<string>) => {
		this.info = e.detail;
	};

	setPageDefinition(pageId?: string) {
		if (!pageId) {
			this.page?.off("infoChanged", this.onInfoChanged);
			this.info = undefined;
			this.page = undefined;
			this.properties = undefined;
			return;
		}
		this.page?.onUnload();

		const Page = this.elementRegistrar.getPageDefinitionById(pageId);
		if (!Page) {
			console.error("Page not found");
			return;
		}
		this.page = new Page.constructor();
		this.page?.on("infoChanged", this.onInfoChanged);
		this.info = this.page?.defaultInfo;
	}

	firstUpdated() {
		this.router.on("lastStepChanged", (e) => {
			const [newStep, prevStep] = e.detail;
			if (newStep?.pageId !== prevStep?.pageId) {
				this.setPageDefinition(newStep?.pageId);
			}
			this.properties = newStep?.properties;
		});

		const latestStep = this.router.getLatestStep();
		if (latestStep) {
			this.setPageDefinition(latestStep.pageId);
			this.properties = latestStep.properties;
		} else {
			this.setPageDefinition("deck-page");
			this.properties = {
				deckId: DEFAULT_DECK.id,
			};
		}
	}

	render() {
		return html`
			<page-header
				info=${ifDefined(this.info)}
				pageId=${ifDefined(this.page?.id)}
				name=${ifDefined(this.page?.name)}
				.actions=${this.page?.getActions()}
			></page-header>
			<sl-divider></sl-divider>
			<page-content
				.page=${this.page}
				.properties=${this.properties}
				@onInfoChanged=${(e: CustomEvent<string>) => (this.info = e.detail)}
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
		sl-divider {
			--spacing: 0;
		}
	`;
}
