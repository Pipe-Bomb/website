"use client";

import { EphemeralSource, useGetAllEphemeralSources } from "@/api";
import { useUrlParam } from "@/hook/url-param.hook";
import { useMemo } from "react";
import styles from "./page.module.scss";
import { cc } from "@/lib/util";
import { EphemeralSearch } from "@/components/search/ephemeral-search.component";
import { LocalSearch } from "@/components/search/local-search.component";
import { RootPadding } from "@/components/root-padding/root-padding.component";

export default function Page() {
	const [query] = useUrlParam("query");

	const [sourceId, setSourceId] = useUrlParam("source", {
		replace: true,
	});

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

	return (
		<div className={styles.container}>
			{ephemeralSources?.status == 200 && (
				<RootPadding className={styles.ephemeralSources} vertical>
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
				</RootPadding>
			)}

			<div className={styles.results}>
				{currentSource ? (
					<EphemeralSearch
						query={query ?? ""}
						pluginId={currentSource.pluginId}
						sourceId={currentSource.id}
					/>
				) : (
					<LocalSearch query={query ?? ""} />
				)}
			</div>
		</div>
	);
}
