"use client";

import { usePlayerStore } from "@/store/player.store";
import { Album, EphemeralTrack, Track } from "@api";
import styles from "./album-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled, IconPlaylistAdd } from "@tabler/icons-react";
import { useMemo } from "react";
import { ListEndIcon, ListStartIcon, ShuffleIcon } from "lucide-react";
import { useTrackListContext } from "@/context/tracklist.context";
import { shuffle } from "@/lib/util";

interface Props {
	album: Album;
}

export function AlbumButtons({ album }: Props) {
	const { playTrack, addToEnd, insert, currentIndex } = usePlayerStore();
	const { trackList: backupTrackList } = useTrackListContext();

	const [playAlbum, shuffleAlbum, playAlbumNext, queueAlbum] = useMemo(() => {
		let trackList: (Track | EphemeralTrack)[] = album.tracks ?? [];
		if (!trackList.length) {
			trackList = backupTrackList;
		}

		if (!trackList.length) {
			return [null, null, null, null];
		}

		return [
			() => playTrack(trackList[0], 0, trackList),
			() => {
				const shuffled = shuffle(trackList);
				playTrack(shuffled[0], 0, shuffled);
			},
			() => insert(trackList, currentIndex),
			() => addToEnd(trackList),
		];
	}, [album, backupTrackList]);

	return (
		<div className={styles.container}>
			<IconButton
				size="xl"
				style="background"
				icon={IconPlayerPlayFilled}
				iconSource="tabler"
				onClick={playAlbum}
				disabled={!playAlbum}
			/>
			<IconButton
				size="md"
				icon={ShuffleIcon}
				iconSource="lucide"
				onClick={shuffleAlbum}
			/>
			<IconButton
				size="md"
				icon={ListStartIcon}
				iconSource="lucide"
				onClick={playAlbumNext}
			/>
			<IconButton
				size="md"
				icon={ListEndIcon}
				iconSource="lucide"
				onClick={queueAlbum}
			/>
		</div>
	);
}
