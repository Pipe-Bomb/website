"use client";

import { Track } from "@api";
import styles from "./queue-track.module.scss";
import { useAttribute } from "@/hook/attribute.hook";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { TrackArtists } from "@/components/track-artists/track-artists.component";
import { usePlayerStore } from "@/store/player.store";
import { cc } from "@/lib/util";
import { IconButton } from "@/components/icon-button/icon-button";
import {
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { useRightClick } from "@/hook/right-click.hook";
import { useCallback } from "react";
import { ContextMenuElement } from "@/context/context-menu.context";

interface Props {
	track: Track;
	queueIndex: number;
}

export function QueueTrack({ track, queueIndex }: Props) {
	const { currentIndex, isPlaying, toggle, playIndex, setIsPlaying, remove } =
		usePlayerStore();

	const cover = useAttribute(track.attributes, "front", "buffer");
	const title =
		useAttribute(track.attributes, "title", "string") ?? track.title;

	const contextMenu = useCallback<() => ContextMenuElement[]>(() => {
		const menu: ContextMenuElement[] = [];

		if (currentIndex != queueIndex) {
			menu.push({
				languageKey: "contextmenu.queue.remove",
				key: "remove",
				onClick: () => remove(queueIndex),
			});
		}

		return menu;
	}, [currentIndex, queueIndex]);

	const rightClick = useRightClick(contextMenu);

	return (
		<div
			className={cc(
				styles.container,
				currentIndex == queueIndex && styles.active,
				currentIndex > queueIndex && styles.history,
			)}
			{...rightClick}
		>
			<div className={styles.imageContainer}>
				<ResourceImage
					resource={cover}
					className={styles.cover}
					fallbackSrc="/no_album_art.jpg"
				/>
				<div className={styles.playButton}>
					<IconButton
						iconSource="tabler"
						icon={
							currentIndex == queueIndex && isPlaying
								? IconPlayerPauseFilled
								: IconPlayerPlayFilled
						}
						style={currentIndex == queueIndex ? "simple" : "background"}
						size="lg"
						onClick={() => {
							if (currentIndex == queueIndex) {
								toggle();
							} else {
								playIndex(queueIndex);
								setIsPlaying(true);
							}
						}}
					/>
				</div>
			</div>
			<div className={styles.info}>
				<span className={styles.title}>{title}</span>
				<span className={styles.artists}>
					<TrackArtists track={track} />
				</span>
			</div>
		</div>
	);
}
