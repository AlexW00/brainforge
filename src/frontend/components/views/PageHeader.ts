import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageAction } from "../../../core/types/views/PageAction";
import { css, html } from "lit";
import { UiEventBus } from "../../../core/services/events/UiEventBus";
import { container } from "tsyringe";
import { PageDefinition } from "../../../core/types/views/PageDefinition";

@customElement("page-header")
export default class PageHeader extends CustomElement {
	private readonly uiEventBus = container.resolve(UiEventBus);

	@property({ type: Object })
	page?: PageDefinition<any>;

	private onClickAction = (action: PageAction) => {
		if (!this.page) return;
		this.uiEventBus.emit("page-action-clicked", {
			pageId: this.page.id,
			actionId: action.id,
		});
	};

	private onClickNavButton = (doNavigateBack: boolean) => {
		console.log("clicked nav button");
	};

	render() {
		return html`
			<div id="nav-buttons">
				<ph-arrow-left
					@click=${() => this.onClickNavButton(true)}
				></ph-arrow-left>
				<ph-arrow-right
					@click=${() => this.onClickNavButton(false)}
				></ph-arrow-right>
			</div>
			<div id="name">${this.page?.name ?? "No active page"}</div>
			<div id="info">${this.page?.getTitle() ?? "Empty"}</div>
			<div id="actions">
				${this.page
					?.getActions()
					.map(
						(action) => html`
							<button @click=${() => this.onClickAction(action)}>
								${action.title}
							</button>
						`
					)}
			</div>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			background: var(--bg-color);
			padding: 0.5rem;
			border-bottom: var(--border-width-small) solid var(--border-color);
			height: var(--page-header-height);
		}
	`;
}
