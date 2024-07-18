/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/debounce.ts
export function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number,
): { (this: ThisParameterType<T>, ...args: Parameters<T>): void; cancel: () => void } {
	let timeout: NodeJS.Timeout | null = null;

	function debounced(this: ThisParameterType<T>, ...args: Parameters<T>) {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	}

	debounced.cancel = () => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = null;
	};

	return debounced;
}
