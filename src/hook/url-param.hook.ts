"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useUrlParam(
	urlKey: string,
	options: {
		replace?: boolean;
		debounceMs?: number;
	} = {},
): [string | null, (newValue: string | null) => void] {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlValue = searchParams.get(urlKey);

	const [localValue, setLocalValue] = useState<string | null>(urlValue);

	useEffect(() => {
		setLocalValue(urlValue);
	}, [urlValue]);

	const updateUrl = useCallback(
		(newValue: string | null) => {
			const params = new URLSearchParams(searchParams.toString());

			if (newValue === null || newValue === "") {
				params.delete(urlKey);
			} else {
				params.set(urlKey, newValue);
			}

			const newUrl = params.toString()
				? `${pathname}?${params.toString()}`
				: pathname;

			if (options.replace) {
				router.replace(newUrl, { scroll: false });
			} else {
				router.push(newUrl, { scroll: false });
			}
		},
		[searchParams, pathname, router, urlKey, !!options.replace],
	);

	useEffect(() => {
		if (
			options.debounceMs === undefined ||
			options.debounceMs === 0 ||
			localValue == urlValue
		) {
			return;
		}

		const timer = setTimeout(() => {
			updateUrl(localValue);
		}, options.debounceMs);

		return () => clearTimeout(timer);
	}, [localValue, urlValue, options.debounceMs, updateUrl]);

	const setValue = useCallback(
		(newValue: string | null) => {
			setLocalValue(newValue);

			if (options.debounceMs === undefined || options.debounceMs === 0) {
				updateUrl(newValue);
			}
		},
		[options.debounceMs, updateUrl],
	);

	return [localValue, setValue];
}
