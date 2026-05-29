"use client";

import { useMemo } from "react";
import { getPlaylistTracks, PlaylistTrack } from "@/api";
import { LazyTrackList } from "@/components/track-list/lazy-track-list.component";
import { ListTrackSkeleton } from "@/components/list-track/list-track-skeleton.component";

interface Props {
	playlistUuid: string;
	totalCount: number;
	initialTracks?: PlaylistTrack[];
}

export function PlaylistTrackList({
	playlistUuid,
	totalCount,
	initialTracks,
}: Props) {
	const queryKey = useMemo(
		() => ["playlist", playlistUuid, "tracks"],
		[playlistUuid],
	);

	const trackNumbers = useMemo(() => {
		return Array.from(
			{
				length: totalCount,
			},
			(_, index) => index + 1,
		);
	}, [totalCount]);

	const fetchChunk = async (offset: number, limit: number) => {
		const response = await getPlaylistTracks(playlistUuid, {
			offset,
			amount: limit,
		});

		if (response.status != 200) {
			throw new Error(`Status code ${response.status}`);
		}

		return response.data.map(({ track }) => track);
	};

	return (
		<LazyTrackList
			totalCount={totalCount}
			queryKey={queryKey}
			fetchChunk={fetchChunk}
			chunkSize={50}
			initialTracks={initialTracks?.map(({ track }) => track)}
			trackNumbers={trackNumbers}
		/>
	);
}
