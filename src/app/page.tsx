"use client";

import { EphemeralSource, useGetAllEphemeralSources } from "@api";
import styles from "./page.module.scss";
import { useMemo, useState } from "react";
import { cc } from "@/lib/util";
import { LocalSearch } from "@/components/search/local-search.component";
import { EphemeralSearch } from "@/components/search/ephemeral-source.component";
import { useUrlParam } from "@/hook/url-param.hook";

export default function Home() {
	const [query, setQuery] = useState("");
	// const [currentSource, setCurrentSource] = useState<EphemeralSource | null>(
	// 	null,
	// );
	const [sourceId, setSourceId] = useUrlParam("source");

	const { data: ephemeralSources } = useGetAllEphemeralSources({
		query: {
			enabled: true,
		},
	});

	const currentSource = useMemo(() => {
		if (!sourceId || !ephemeralSources) {
			return null;
		}
		const parts = sourceId.split("~");
		if (parts.length != 2) {
			return null;
		}
		const source = ephemeralSources.data.find(
			(source) => source.pluginId == parts[0] && source.id == parts[1],
		);
		return source ?? null;
	}, [sourceId, ephemeralSources]);

	const toggleSource = (source: EphemeralSource) => {
		if (currentSource === source) {
			setSourceId(null);
		} else {
			setSourceId(`${source.pluginId}~${source.id}`);
		}
	};

	// const [options, setOptions] = useState<SearchDto>({
	// 	withAlbums: true,
	// 	withArtists: true,
	// 	withTracks: true,
	// 	query: null,
	// 	source: null,
	// });
	// const [debouncedOptions, isDebouncingOptions] = useDebounce(options, 1_000);

	// const search = useSearch();

	return (
		<div>
			<div className={styles.searchContainer}>
				<input
					type="text"
					value={query}
					className={styles.searchBox}
					onInput={(e) => setQuery(e.currentTarget.value)}
					placeholder="Search"
				/>
			</div>
			{ephemeralSources?.status == 200 && (
				<div className={styles.ephemeralSources}>
					{ephemeralSources.data.map((source) => (
						<button
							key={`${source.pluginId} ${source.id}`}
							onClick={() => toggleSource(source)}
							className={cc(
								styles.ephemeralSourceButton,
								currentSource == source && styles.active,
							)}
						>
							{source.name}
						</button>
					))}
				</div>
			)}

			<div className={styles.results}>
				{currentSource ? (
					<EphemeralSearch
						query={query}
						pluginId={currentSource.pluginId}
						sourceId={currentSource.id}
					/>
				) : (
					<LocalSearch query={query} />
				)}
			</div>
		</div>
	);
}
