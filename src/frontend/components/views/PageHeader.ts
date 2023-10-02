import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageAction } from "../../../core/types/views/PageAction";
import { css, html } from "lit";
import { UiEventBus } from "../../../core/services/events/UiEventBus";
import { container } from "tsyringe";
import { RouterService } from "../../../core/services/app/RouterService";

@customElement("page-header")
export default class PageHeader extends CustomElement {
	private readonly uiEventBus = container.resolve(UiEventBus);
	private readonly router = container.resolve(RouterService);

	@property({ type: String })
	pageId?: string;

	@property({ type: String })
	name?: string;

	@property({ type: String })
	info?: string;

	@property({ type: Array })
	actions?: PageAction[];

	private onClickAction = (action: PageAction) => {
		if (!this.pageId) return;
		action.onClick();
		this.uiEventBus.emit("page-action-clicked", {
			pageId: this.pageId,
			actionId: action.id,
		});
	};

	private onClickNavButton = (doNavigateBack: boolean) => {
		if (doNavigateBack) this.router.navigateBack();
		else this.router.navigateForward();
	};

	render() {
		return html`
			<div id="nav-buttons">
				<icon-button @click=${() => this.onClickNavButton(true)}>
					<ph-arrow-left></ph-arrow-left>
				</icon-button>
				<icon-button @click=${() => this.onClickNavButton(false)}>
					<ph-arrow-right></ph-arrow-right>
				</icon-button>
			</div>
			<div id="name">[${this.name ?? "No active page"}]</div>
			<div id="info">${this.info ?? "Empty"}</div>
			<div id="actions">
				${this.actions?.map(
					(action) => html`
						<text-button @click=${() => this.onClickAction(action)}>
							${action.title}
						</text-button>
					`
				)}
			</div>
		`;
	}

	// info is center, nav buttons and name are left, actions are right
	static styles = css`
		:host {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16px;
		}

		#nav-buttons {
			display: flex;
			align-items: center;
		}

		#name {
			margin-left: 16px;
			font-weight: bold;
			font-size: var(--font-size-large);
		}

		#info {
			flex: 1;
			text-align: center;
			opacity: 0.6;
		}

		#actions {
			display: flex;
			align-items: center;
			gap: 8px;
		}

		#nav-buttons {
			display: flex;
			align-items: center;
			gap: 8px;
		}
	`;
}
