"use client";

import { useUrlParam } from "@/hook/url-param.hook";

export function useUrlPagination(urlKey: string = "page") {
	const [value, setValue] = useUrlParam(urlKey);

	const currentPage = Number(value) || 1;

	const setPage = (newPage: number) => {
		if (newPage <= 1) {
			setValue(null);
		} else {
			setValue(newPage.toString());
		}
	};

	return { currentPage, setPage };
}
