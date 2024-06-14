import { singleton } from "tsyringe";

@singleton()
export class ToastService {
	escapeHtml(html: string) {
		const div = document.createElement("div");
		div.textContent = html;
		return div.innerHTML;
	}

	notify(
		message: string,
		variant = "primary",
		icon = "info-circle",
		duration = 2000
	) {
		const alert = Object.assign(document.createElement("sl-alert"), {
			variant,
			closable: true,
			duration: duration,
			innerHTML: `
			<sl-icon name="${icon}" slot="icon"></sl-icon>
			${this.escapeHtml(message)}
		  `,
		});

		document.body.append(alert);
		return alert.toast();
	}
}
