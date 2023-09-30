export class EventBus<T extends Record<string, any>> extends EventTarget {
	dispatchTypedEvent<K extends keyof T>(type: K, detail: T[K]) {
		const event = new CustomEvent(type as string, { detail });
		this.dispatchEvent(event);
	}

	addTypedEventListener<K extends keyof T>(
		type: K,
		listener: (event: CustomEvent<T[K]>) => void,
		options?: boolean | AddEventListenerOptions
	): void {
		this.addEventListener(type as string, listener as EventListener, options);
	}

	removeTypedEventListener<K extends keyof T>(
		type: K,
		listener: (event: CustomEvent<T[K]>) => void,
		options?: boolean | EventListenerOptions
	): void {
		this.removeEventListener(
			type as string,
			listener as EventListener,
			options
		);
	}
}
