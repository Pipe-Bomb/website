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
import { EphemeralTrack, Track } from "@api";
import { useAttribute } from "@/hook/attribute.hook";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { TrackArtists } from "@/components/track-artists/track-artists.component";
import { useSidebarStore } from "@/store/sidebar.store";
import { useRawAttribute } from "@/hook/raw-attribute.hook";
import { useTrack } from "@/hook/track.hook";
import Link from "next/link";

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
	const currentTrackResult = useTrack(queue[currentIndex]);

	return (
		<div className={styles.container}>
			<div className={styles.left}>
				{currentTrackResult.data && (
					<NowPlaying track={currentTrackResult.data} />
				)}
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
	track: Track | EphemeralTrack;
}

function NowPlaying({ track }: NowPlayingProps) {
	const title =
		useAttribute(track.attributes, "title", "string") ?? track.title;
	const cover = useRawAttribute(track.attributes, "front", "buffer");

	return (
		<div className={styles.nowPlaying}>
			<Link
				href={`/track/${track.pluginId}/${track.libraryId}/${track.trackId}`}
			>
				<ResourceImage
					resource={cover}
					className={styles.nowPlayingCover}
					fallbackSrc="/no_album_art.jpg"
				/>
			</Link>

			<div className={styles.nowPlayingInfo}>
				<Link
					className={styles.nowPlayingTitle}
					href={`/track/${track.pluginId}/${track.libraryId}/${track.trackId}`}
				>
					{title}
				</Link>
				<span className={styles.nowPlayingArtist}>
					{"artists" in track ? (
						<TrackArtists track={track} />
					) : (
						<span>Unknown Artist</span>
					)}
				</span>
			</div>
		</div>
	);
}
