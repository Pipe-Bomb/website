import { useLayoutEffect, useState } from "react";

let registeredModals = 0;

const callbacks: (() => void)[] = [];
const backgroundCallbacks: (() => void)[] = [];

export function useModalRegister() {
	const [count, setCount] = useState(registeredModals);

	function registerModal(backgroundCallback: () => void) {
		registeredModals++;

		backgroundCallbacks.push(backgroundCallback);

		for (const callback of callbacks) {
			callback();
		}

		return () => {
			registeredModals--;
			const index = backgroundCallbacks.indexOf(backgroundCallback);
			if (index >= 0) {
				backgroundCallbacks.splice(index, 1);
			}
			for (const callback of callbacks) {
				callback();
			}
		};
	}

	useLayoutEffect(() => {
		const listener = () => {
			setCount(registeredModals);
		};

		callbacks.push(listener);
		return () => {
			const index = callbacks.indexOf(listener);
			if (index >= 0) {
				callbacks.splice(index, 1);
			}
		};
	}, []);

	return {
		registerModal,
		modalCount: count,
		lastCallback: () => {
			if (backgroundCallbacks.length) {
				const callback = backgroundCallbacks[backgroundCallbacks.length - 1];
				callback();
			}
		},
	};
}
