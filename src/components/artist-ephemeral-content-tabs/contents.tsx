"use client";

import { useUrlParam } from "@/hook/url-param.hook";
import { ArtistEphemeralContent } from "@api";
import { useMemo } from "react";
import styles from "./artist-ephemeral-content-tabs.module.scss";
import { Button } from "@/components/button/button.component";
import { SearchResults } from "@/components/search-results/search-results.component";

interface Props {
	sources: ArtistEphemeralContent[];
}

export function Contents({ sources }: Props) {
	const [sourceId, setSourceId] = useUrlParam("source");
	const activeSource = useMemo(() => {
		if (sourceId) {
			const match = sources.find(
				(source) => `${source.source.pluginId}~${source.source.id}` == sourceId,
			);
			if (match) {
				return match;
			}
		}
		return sources[0];
	}, [sources, sourceId]);

	return (
		<div className={styles.container}>
			<div className={styles.tabButtons}>
				{sources.map((source) => (
					<Button
						key={`${source.source.pluginId} ${source.source.id}`}
						style={activeSource == source ? "primary" : "secondary"}
					>
						{source.source.name}
					</Button>
				))}
			</div>
			<div className={styles.results}>
				<SearchResults tracks={activeSource.tracks} artists={[]} albums={[]} />
			</div>
		</div>
	);
}
