export class Observable<T extends Record<string, any>> extends EventTarget {
	/**
	 * Emit an event
	 * @param type The event type
	 * @param detail The event detail
	 */
	emit<K extends keyof T>(type: K, detail: T[K]) {
		const event = new CustomEvent(type as string, { detail });
		this.dispatchEvent(event);
	}

	/**
	 * Add an event listener
	 * @param type The event type
	 * @param listener The event listener
	 * @param options The event listener options
	 */
	on<K extends keyof T>(
		type: K,
		listener: (event: CustomEvent<T[K]>) => void,
		options?: boolean | AddEventListenerOptions
	): void {
		this.addEventListener(type as string, listener as EventListener, options);
	}

	/**
	 * Remove an event listener
	 * @param type The event type
	 * @param listener The event listener
	 * @param options The event listener options
	 */
	off<K extends keyof T>(
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

	/**
	 * Add an event listener that will be called only once
	 * @param type The event type
	 * @param listener The event listener
	 * @param options The event listener options
	 */
	once<K extends keyof T>(
		type: K,
		listener: (event: CustomEvent<T[K]>) => void,
		options?: boolean | AddEventListenerOptions
	): void {
		const onceListener = (event: CustomEvent<T[K]>) => {
			listener(event);
			this.removeEventListener(
				type as string,
				onceListener as EventListener,
				options
			);
		};
		this.addEventListener(
			type as string,
			onceListener as EventListener,
			options
		);
	}
}
