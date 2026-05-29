"use client";

import { getAllPlaylistTrackIds, Playlist } from "@api";
import styles from "./playlist-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { ListEndIcon, ListStartIcon, ShuffleIcon } from "lucide-react";
import { useIsMounted } from "@/hook/mounted.hook";
import { useQueueActions } from "@/hook/queue-actions.hook";
import { shuffle } from "@/lib/util";

interface Props {
	playlist: Playlist;
}

export function PlaylistButtons({ playlist }: Props) {
	const { playEntireList, playListNext, addToEnd } = useQueueActions();
	const isMounted = useIsMounted();
	const [isLoadingTracklist, setIsLoadingTracklist] = useState(false);

	const tracklist = useMemo(() => {
		return playlist.tracks?.map(({ track }) => track) ?? null;
	}, [playlist.tracks]);

	const getFullTracklist = useCallback(async () => {
		if (
			tracklist &&
			playlist.trackCount !== null &&
			tracklist.length >= playlist.trackCount
		) {
			return tracklist;
		}
		setIsLoadingTracklist(true);

		try {
			const response = await getAllPlaylistTrackIds(playlist.uuid);
			if (response.status != 200) {
				throw new Error(`Status code ${response.status}`);
			}
			return response.data.map(({ track }) => track);
		} finally {
			setIsLoadingTracklist(false);
		}
	}, [playlist, playlist.trackCount]);

	return (
		<div className={styles.container}>
			{isMounted && (
				<>
					<IconButton
						size="xl"
						style="background"
						icon={IconPlayerPlayFilled}
						iconSource="tabler"
						onClick={() =>
							getFullTracklist().then((tracklist) =>
								playEntireList(tracklist ?? [], 0),
							)
						}
						disabled={!tracklist}
						loading={isLoadingTracklist}
					/>
					<IconButton
						size="md"
						icon={ShuffleIcon}
						iconSource="lucide"
						onClick={() =>
							getFullTracklist().then((tracklist) =>
								playEntireList(shuffle(tracklist), 0),
							)
						}
						disabled={!tracklist}
					/>
					<IconButton
						size="md"
						icon={ListStartIcon}
						iconSource="lucide"
						onClick={() =>
							getFullTracklist().then((tracklist) =>
								playListNext(tracklist ?? []),
							)
						}
						disabled={!tracklist}
					/>
					<IconButton
						size="md"
						icon={ListEndIcon}
						iconSource="lucide"
						onClick={() =>
							getFullTracklist().then((tracklist) => addToEnd(tracklist ?? []))
						}
						disabled={!tracklist}
					/>
				</>
			)}
		</div>
	);
}
