import { customElement, property } from "lit/decorators.js";
import { CustomElement } from "../atomic/CustomElement";
import { PageAction } from "../../../core/types/views/PageAction";
import { css, html } from "lit";
import { UiEventBus } from "../../../core/services/events/UiEventBus";
import { container } from "tsyringe";
import { RouterService } from "../../../core/services/app/RouterService";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button";

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
			<div class="left">
				<div id="nav-buttons">
					<sl-icon-button
						name="arrow-left"
						library="ph-regular"
						@click=${() => this.onClickNavButton(true)}
					>
					</sl-icon-button>
					<sl-icon-button
						name="arrow-right"
						library="ph-regular"
						@click=${() => this.onClickNavButton(false)}
					>
					</sl-icon-button>
				</div>
				<div id="name" class="no-select">
					[${this.name ?? "No active page"}]
				</div>
			</div>

			<div id="info" class="center no-select">${this.info ?? "Empty"}</div>
			<div id="actions" class="right">
				${this.actions?.map(
					(action) => html`
						<sl-icon-button
							name="gear"
							label="Settings"
							@click=${() => this.onClickAction(action)}
						>
							${action.title}
						</sl-icon-button>
					`
				)}
			</div>
		`;
	}

	static styles = css`
		:host {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16px;
		}

		.left,
		.right,
		#nav-buttons,
		#actions {
			display: flex;
			align-items: center;
		}

		.left {
			justify-content: flex-start;
			flex: 1;
		}

		.right {
			justify-content: flex-end;
			flex: 1;
		}

		.center {
			flex: 2;
			text-align: center;
			opacity: 0.6;
		}

		#name {
			margin-left: 16px;
			font-weight: bold;
		}

		#actions,
		#nav-buttons {
			gap: 8px;
		}
	`;
}
