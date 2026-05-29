"use client";

import { EphemeralTrack, Track } from "@/api";
import { ListTrackSkeleton } from "@/components/list-track/list-track-skeleton.component";
import { ListTrack } from "@/components/list-track/list-track.component";
import { BaseTrackList } from "@/components/track-list/base-track-list.component";
import { AttributeColumn } from "@/context/track-columns.context";
import { useQuery } from "@tanstack/react-query";

interface Props {
	totalCount: number;
	queryKey: unknown[];
	fetchChunk: (
		offset: number,
		limit: number,
	) => Promise<(Track | EphemeralTrack)[]>;
	chunkSize?: number;
	trackNumbers?: number[];
	noArt?: boolean;
	initialTracks?: (Track | EphemeralTrack)[];
}

export function LazyTrackList({
	totalCount,
	queryKey,
	fetchChunk,
	chunkSize = 50,
	trackNumbers,
	noArt,
	initialTracks,
}: Props) {
	return (
		<BaseTrackList
			totalCount={totalCount}
			itemContent={(index, columns) => (
				<Row
					index={index}
					columns={columns}
					queryKey={queryKey}
					fetchChunk={fetchChunk}
					chunkSize={chunkSize}
					trackNumber={trackNumbers?.[index]}
					noArt={noArt}
					initialTracks={initialTracks}
				/>
			)}
		/>
	);
}

interface RowProps {
	index: number;
	columns: AttributeColumn[];
	queryKey: unknown[];
	fetchChunk: (
		offset: number,
		limit: number,
	) => Promise<(Track | EphemeralTrack)[]>;
	chunkSize: number;
	trackNumber?: number;
	noArt?: boolean;
	initialTracks?: (Track | EphemeralTrack)[];
}

function Row({
	index,
	columns,
	queryKey,
	fetchChunk,
	chunkSize,
	trackNumber,
	noArt,
	initialTracks,
}: RowProps) {
	const chunkIndex = Math.floor(index / chunkSize);
	const localIndex = index % chunkSize;

	const { data: chunkTracks, isLoading } = useQuery({
		queryKey: [...queryKey, "chunk", chunkIndex],
		queryFn: () => fetchChunk(chunkIndex * chunkSize, chunkSize),
		staleTime: 5 * 60 * 1000,
		placeholderData: (prev) => prev,
		initialData: chunkIndex === 0 ? initialTracks : undefined,
	});

	if (isLoading || !chunkTracks) {
		return <ListTrackSkeleton number={trackNumber} noArt={noArt} />;
	}

	const track = chunkTracks[localIndex];
	if (!track) {
		return null;
	}

	return (
		<ListTrack
			track={track}
			columns={columns}
			number={trackNumber}
			noArt={noArt}
		/>
	);
}
