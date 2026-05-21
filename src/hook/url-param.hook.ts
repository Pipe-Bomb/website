"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useUrlParam(
	urlKey: string,
	options: {
		replace?: boolean;
	} = {},
): [string | null, (newValue: string | null) => void] {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const value = searchParams.get(urlKey);

	const setValue = useCallback(
		(newValue: string | null) => {
			const params = new URLSearchParams(searchParams.toString());

			if (newValue === null) {
				params.delete(urlKey);
			} else {
				params.set(urlKey, newValue);
			}

			const newUrl = `${pathname}?${params.toString()}`;
			if (options.replace) {
				router.replace(newUrl, { scroll: false });
			} else {
				router.push(newUrl, { scroll: false });
			}
		},
		[searchParams, pathname, router, urlKey, !!options.replace],
	);

	return [value, setValue];
}
