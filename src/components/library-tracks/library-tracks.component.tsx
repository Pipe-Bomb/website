"use client";

import { PluginLibrary } from "@api";
import { useEffect } from "react";
import { ListTrack } from "../list-track/list-track.component";
import styles from "./library-tracks.module.scss";
import { useSearchLibrary } from "@api";
import { Paginator } from "@/components/paginator/paginator.component";
import { useUrlPagination } from "@/hook/url-pagination.hook";
import { Spinner } from "@/components/spinner/spinner.component";
import { TrackList } from "@/components/track-list/track-list.component";

interface Props {
	library: PluginLibrary;
}

export function LibraryTracks({ library }: Props) {
	const search = useSearchLibrary();
	const { currentPage } = useUrlPagination();

	useEffect(() => {
		search.mutate({
			pluginId: library.pluginId,
			libraryId: library.id,
			data: {
				page: currentPage,
				pageSize: 30,
			},
		});
	}, [library.pluginId, library.id, currentPage]);

	if (!search.data) {
		return (
			<div className={styles.loading}>
				<Spinner position="expand" />
			</div>
		);
	}

	if (search.data.status == 404) {
		return <h1>Not found</h1>;
	}

	const response = search.data.data;
	const tracks = response.tracks;

	return (
		<div className={styles.container}>
			<TrackList tracks={tracks} />
			<div className={styles.pageBar}>
				<Paginator urlKey="page" />
			</div>
		</div>
	);
}
