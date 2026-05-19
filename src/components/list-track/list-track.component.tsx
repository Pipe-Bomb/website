"use client";

import { Track } from "@api";
import styles from "./list.track.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import {
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useRightClick } from "@/hook/right-click.hook";
import { TrackInfoModal } from "@/components/track-info-modal/track-info-modal";
import { useMemo, useState } from "react";
import { useAttribute } from "@/hook/attribute.hook";
import Link from "next/link";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { usePlayerStore } from "@/store/player.store";
import { TrackArtists } from "@/components/track-artists/track-artists.component";
import { cc } from "@/lib/util";
import { TrackAlbum } from "@/components/track-album/track-album.component";

interface Props {
	track: Track;
}

export function ListTrack({ track }: Props) {
	const [infoOpen, setInfoOpen] = useState(false);
	const {
		addToEnd,
		playNext,
		playNow,
		queue,
		currentIndex,
		isPlaying,
		toggle,
	} = usePlayerStore();
	const nowPlaying = queue[currentIndex];

	const isPlayingThis = useMemo(
		() =>
			nowPlaying &&
			nowPlaying.pluginId == track.pluginId &&
			nowPlaying.libraryId == track.libraryId &&
			nowPlaying.id == track.id,
		[nowPlaying, track],
	);

	const title =
		useAttribute(track.attributes, "title", "string") ?? track.title;
	const album = useAttribute(track.attributes, "album", "string");
	const image = useAttribute(track.attributes, "front", "buffer");

	const rightClick = useRightClick(() => [
		{
			languageKey: "contextmenu.track.play-next",
			key: "play-next",
			onClick: () => playNext(track),
		},
		{
			languageKey: "contextmenu.track.add-to-queue",
			key: "add-to-queue",
			onClick: () => addToEnd([track]),
		},
		{
			languageKey: "contextmenu.track.view-info",
			key: "view-info",
			onClick: () => setInfoOpen(true),
		},
	]);

	return (
		<>
			<div
				className={cc(styles.container, isPlayingThis && styles.active)}
				{...rightClick}
			>
				<div className={styles.imageContainer}>
					<ResourceImage
						resource={image}
						className={styles.cover}
						fallbackSrc="/no_album_art.jpg"
					/>
					<div className={styles.playButton}>
						<IconButton
							icon={
								isPlayingThis && isPlaying
									? IconPlayerPauseFilled
									: IconPlayerPlayFilled
							}
							iconSource="tabler"
							style={isPlayingThis ? "simple" : "background"}
							onClick={() => {
								if (isPlayingThis) {
									toggle();
								} else {
									playNow(track);
								}
							}}
						/>
					</div>
				</div>
				<div className={styles.info}>
					<span className={styles.title}>
						<Link
							href={`/track/${track.pluginId}/${track.libraryId}/${track.id}`}
						>
							{title}
						</Link>
					</span>

					{!!track.artists && (
						<span className={styles.artist}>
							<TrackArtists track={track} />
						</span>
					)}
					{!!track.albums && (
						<span className={styles.album}>
							<TrackAlbum album={track.albums?.[0] ?? null} fallback={album} />
						</span>
					)}
				</div>
			</div>
			<TrackInfoModal
				track={track}
				open={infoOpen}
				onClose={() => setInfoOpen(false)}
			/>
		</>
	);
}
