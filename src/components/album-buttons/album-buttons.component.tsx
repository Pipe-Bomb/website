"use client";

import { usePlayerStore } from "@/store/player.store";
import { Album } from "@api";
import styles from "./album-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled, IconPlaylistAdd } from "@tabler/icons-react";
import { useMemo } from "react";
import { ListEndIcon, ListStartIcon } from "lucide-react";

interface Props {
	album: Album;
}

export function AlbumButtons({ album }: Props) {
	const { playTrack, addToEnd, insert, currentIndex } = usePlayerStore();

	const [playAlbum, playAlbumNext, queueAlbum] = useMemo(() => {
		const tracklist = album.tracks;
		if (!tracklist?.length) {
			return [null, null, null];
		}

		return [
			() => playTrack(tracklist[0], 0, tracklist),
			() => insert(tracklist, currentIndex + 1),
			() => addToEnd(tracklist),
		];
	}, [album, playTrack]);

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
