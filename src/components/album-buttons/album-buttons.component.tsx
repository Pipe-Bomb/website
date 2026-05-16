"use client";

import { usePlayerStore } from "@/store/player.store";
import { Album } from "@api/model";
import styles from "./album-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled, IconPlaylistAdd } from "@tabler/icons-react";
import { useMemo } from "react";

interface Props {
	album: Album;
}

export function AlbumButtons({ album }: Props) {
	const { playTrack, addToEnd } = usePlayerStore();

	const [playAlbum, queueAlbum] = useMemo(() => {
		const tracklist = album.tracks;
		if (!tracklist?.length) {
			return [null, null];
		}

		return [
			() => playTrack(tracklist[0], 0, tracklist),
			() => addToEnd(tracklist),
		];
	}, [album, playTrack]);

	return (
		<div className={styles.container}>
			<IconButton
				size="xl"
				style="background"
				icon={IconPlayerPlayFilled}
				onClick={() => playAlbum?.()}
				disabled={!playAlbum}
			/>
			<IconButton
				size="lg"
				icon={IconPlaylistAdd}
				onClick={() => queueAlbum?.()}
				disabled={!queueAlbum}
			/>
		</div>
	);
}
