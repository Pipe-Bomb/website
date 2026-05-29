"use client";

import { Album } from "@api";
import styles from "./album-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useMemo } from "react";
import { ListEndIcon, ListStartIcon, ShuffleIcon } from "lucide-react";
import { useTrackListContext } from "@/context/tracklist.context";
import { useIsMounted } from "@/hook/mounted.hook";
import { useQueueActions } from "@/hook/queue-actions.hook";

interface Props {
	album: Album;
}

export function AlbumButtons({ album }: Props) {
	// const { playTrack, addToEnd, insert, currentIndex } = usePlayerStore();
	const { playEntireList, playListNext, addToEnd } = useQueueActions();
	const { trackList: backupTrackList } = useTrackListContext();
	const isMounted = useIsMounted();

	const tracklist = useMemo(() => {
		if (album.tracks?.length) {
			return album.tracks;
		}
		return backupTrackList;
	}, [album.tracks, backupTrackList]);

	return (
		<div className={styles.container}>
			{isMounted && (
				<>
					<IconButton
						size="xl"
						style="background"
						icon={IconPlayerPlayFilled}
						iconSource="tabler"
						onClick={() => playEntireList(tracklist, 0)}
						disabled={!tracklist.length}
					/>
					<IconButton
						size="md"
						icon={ShuffleIcon}
						iconSource="lucide"
						// onClick={shuffleAlbum}
						disabled={!tracklist.length}
					/>
					<IconButton
						size="md"
						icon={ListStartIcon}
						iconSource="lucide"
						onClick={() => playListNext(tracklist)}
						disabled={!tracklist.length}
					/>
					<IconButton
						size="md"
						icon={ListEndIcon}
						iconSource="lucide"
						onClick={() => addToEnd(tracklist)}
						disabled={!tracklist.length}
					/>
				</>
			)}
		</div>
	);
}
