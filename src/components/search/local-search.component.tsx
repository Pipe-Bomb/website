import { SearchDto, useSearch } from "@/api";
import { SearchResults } from "@/components/search-results/search-results.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { useDebounce } from "@/hook/debounce.hook";
import { useEffect, useState } from "react";
import styles from "./search.module.scss";

interface Props {
	query: string;
}

export function LocalSearch({ query }: Props) {
	const [options, setOptions] = useState<SearchDto>({
		withAlbums: true,
		withArtists: true,
		withTracks: true,
		query,
	});
	const [debouncedOptions, isDebouncingOptions] = useDebounce(options, 1_000);

	useEffect(() => {
		setOptions((options) => ({
			...options,
			query,
		}));
	}, [query]);

	const search = useSearch();

	useEffect(() => {
		search.mutate({
			data: debouncedOptions,
		});
	}, [debouncedOptions]);

	if (!search.data || isDebouncingOptions || search.isPending) {
		return (
			<div className={styles.searchLoading}>
				<Spinner position="expand" />
			</div>
		);
	}

	const results = search.data.data;

	return (
		<SearchResults
			tracks={results.tracks}
			artists={results.artists}
			albums={results.albums}
		/>
	);
}
