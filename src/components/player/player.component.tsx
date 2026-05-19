"use client";

import { ProgressTrack } from "@/components/progress-track/progress-track.component";
import styles from "./player.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import {
	IconLayoutSidebarRightCollapseFilled,
	IconLayoutSidebarRightExpandFilled,
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
	IconPlayerSkipBackFilled,
	IconPlayerSkipForwardFilled,
} from "@tabler/icons-react";
import { usePlayerStore } from "@/store/player.store";
import { formatTime } from "@/lib/util";
import { Track } from "@api";
import { useAttribute } from "@/hook/attribute.hook";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { TrackArtists } from "@/components/track-artists/track-artists.component";
import { useSidebarStore } from "@/store/sidebar.store";

export function Player() {
	const { open: isSidebarOpen, toggle: toggleSidebar } = useSidebarStore();
	const {
		isPlaying,
		toggle,
		duration,
		currentTime,
		seek,
		queue,
		currentIndex,
		next,
		prev,
		setIsPlaying,
		isBuffering,
	} = usePlayerStore();
	const nowPlaying: Track | null = queue[currentIndex];

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				{nowPlaying && <NowPlaying track={nowPlaying} />}
			</div>
			<div className={styles.center}>
				<div className={styles.centerButtons}>
					<IconButton
						icon={IconPlayerSkipBackFilled}
						iconSource="tabler"
						onClick={() => {
							prev();
							setIsPlaying(true);
						}}
					/>
					<IconButton
						icon={isPlaying ? IconPlayerPauseFilled : IconPlayerPlayFilled}
						iconSource="tabler"
						style="background"
						size="lg"
						onClick={toggle}
					/>
					<IconButton
						icon={IconPlayerSkipForwardFilled}
						iconSource="tabler"
						onClick={() => {
							next();
							setIsPlaying(true);
						}}
					/>
				</div>
				<div className={styles.progressContainer}>
					<span className={styles.duration}>{formatTime(currentTime)}</span>
					<div className={styles.progressTrack}>
						<ProgressTrack
							max={duration}
							value={currentTime}
							onChange={seek}
							loading={isBuffering}
						/>
					</div>
					<span className={styles.duration}>
						{duration == -1 ? "-:-" : formatTime(duration)}
					</span>
				</div>
			</div>
			<div className={styles.right}>
				<IconButton
					iconSource="tabler"
					icon={
						isSidebarOpen
							? IconLayoutSidebarRightCollapseFilled
							: IconLayoutSidebarRightExpandFilled
					}
					onClick={toggleSidebar}
				/>
			</div>
		</div>
	);
}

interface NowPlayingProps {
	track: Track;
}

function NowPlaying({ track }: NowPlayingProps) {
	const title =
		useAttribute(track.attributes, "title", "string") ?? track.title;
	const cover = useAttribute(track.attributes, "front", "buffer");

	return (
		<div className={styles.nowPlaying}>
			<ResourceImage
				resource={cover}
				className={styles.nowPlayingCover}
				fallbackSrc="/no_album_art.jpg"
			/>
			<div className={styles.nowPlayingInfo}>
				<span className={styles.nowPlayingTitle}>{title}</span>
				<span className={styles.nowPlayingArtist}>
					<TrackArtists track={track} />
				</span>
			</div>
		</div>
	);
}
