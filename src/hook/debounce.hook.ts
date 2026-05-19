import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): [T, boolean] {
	const [debounced, setDebounced] = useState(value);
	const [isDebouncing, setIsDebouncing] = useState(false);

	useEffect(() => {
		setIsDebouncing(true);

		const timer = setTimeout(() => {
			setDebounced(value);
			setIsDebouncing(false);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return [debounced, isDebouncing];
}
