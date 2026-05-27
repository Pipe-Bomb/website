"use client";

import { usePlayerStore } from "@/store/player.store";
import { Playlist } from "@api";
import styles from "./playlist-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useMemo } from "react";
import { ListEndIcon, ListStartIcon, ShuffleIcon } from "lucide-react";
import { shuffle } from "@/lib/util";
import { useIsMounted } from "@/hook/mounted.hook";

interface Props {
	playlist: Playlist;
}

export function PlaylistButtons({ playlist }: Props) {
	const { playTrack, addToEnd, insert, currentIndex } = usePlayerStore();
	const isMounted = useIsMounted();

	const [playPlaylist, shufflePlaylist, playPlaylistNext, queuePlaylist] =
		useMemo(() => {
			const trackList = playlist.tracks?.map(({ track }) => track) ?? [];

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
		}, [playlist]);

	return (
		<div className={styles.container}>
			{isMounted && (
				<>
					<IconButton
						size="xl"
						style="background"
						icon={IconPlayerPlayFilled}
						iconSource="tabler"
						onClick={playPlaylist}
						disabled={!playPlaylist}
					/>
					<IconButton
						size="md"
						icon={ShuffleIcon}
						iconSource="lucide"
						onClick={shufflePlaylist}
					/>
					<IconButton
						size="md"
						icon={ListStartIcon}
						iconSource="lucide"
						onClick={playPlaylistNext}
					/>
					<IconButton
						size="md"
						icon={ListEndIcon}
						iconSource="lucide"
						onClick={queuePlaylist}
					/>
				</>
			)}
		</div>
	);
}
