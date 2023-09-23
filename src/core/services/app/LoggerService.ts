import { singleton } from "@launchtray/tsyringe-async";

@singleton()
export class LoggerService {
	public log(...args: any[]) {
		console.log(...args);
	}

	public warn(...args: any[]) {
		console.warn(...args);
	}

	public error(...args: any[]) {
		console.error(...args);
	}

	public info(...args: any[]) {
		console.info(...args);
	}

	public debug(...args: any[]) {
		console.debug(...args);
	}
}
