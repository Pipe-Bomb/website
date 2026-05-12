// hooks/use-url-pagination.ts
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useUrlPagination(urlKey: string = "page") {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// 1. Get the current page from URL
	const currentPage = Number(searchParams.get(urlKey)) || 1;

	// 2. Function to update the URL
	const setPage = useCallback(
		(newPage: number) => {
			const params = new URLSearchParams(searchParams.toString());

			if (newPage <= 1) {
				params.delete(urlKey); // Keep the URL clean if it's page 1
			} else {
				params.set(urlKey, newPage.toString());
			}

			// router.push performs a client-side navigation without a full refresh
			// scroll: false prevents the window from jumping to the top
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[searchParams, pathname, router, urlKey],
	);

	return { currentPage, setPage };
}
