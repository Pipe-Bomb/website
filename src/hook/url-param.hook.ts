"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useUrlParam(
	urlKey: string,
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

			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[searchParams, pathname, router, urlKey],
	);

	return [value, setValue];
}
