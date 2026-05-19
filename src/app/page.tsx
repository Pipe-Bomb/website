"use client";

import { SearchDto, useSearch } from "@api";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hook/debounce.hook";
import { Spinner } from "@/components/spinner/spinner.component";
import { SearchResults } from "@/components/search-results/search-results.component";

export default function Home() {
	const [options, setOptions] = useState<SearchDto>({
		withAlbums: true,
		withArtists: true,
		withTracks: true,
	});
	const [debouncedOptions, isDebouncingOptions] = useDebounce(options, 1_000);

	const search = useSearch();

	useEffect(() => {
		search.mutate({
			data: debouncedOptions,
		});
	}, [debouncedOptions]);

	return (
		<div>
			<div className={styles.searchContainer}>
				<input
					type="text"
					value={options.query ?? ""}
					className={styles.searchBox}
					onInput={(e) => {
						const value = e.currentTarget.value;
						setOptions((current) => ({
							...current,
							query: value || undefined,
						}));
					}}
				/>
			</div>

			{search.data && !isDebouncingOptions ? (
				<div>
					<SearchResults
						tracks={search.data.data.tracks}
						artists={search.data.data.artists}
						albums={search.data.data.albums}
					/>
				</div>
			) : (
				<div className={styles.searchLoading}>
					<Spinner position="expand" />
				</div>
			)}
		</div>
	);
}
