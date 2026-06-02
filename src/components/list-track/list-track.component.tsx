"use client";

import {
	addTracksToPlaylist,
	AttributeMap,
	EphemeralTrack,
	Playlist,
	Track,
} from "@api";
import styles from "./list-track.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import {
	IconExternalLinkFilled,
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
import {
	BasicAttributeColumn,
	SpecialAttributeColumnValue,
} from "@/context/track-columns.context";
import { useRawAttribute } from "@/hook/raw-attribute.hook";
import { AttributeUnion } from "@/lib/attribute.util";
import { PlaylistSelectModal } from "@/modal/playlist-select/playlist-select.modal";
import { serializeTrackKey } from "@/lib/track-batcher.util";
import { useQueueActions } from "@/hook/queue-actions.hook";
import { useNotificationStore } from "@/store/notification.store";
import { OptionalLink } from "@/components/optional-link/optional-link.component";

interface Props {
	track: Track | EphemeralTrack;
	columns?: (BasicAttributeColumn | SpecialAttributeColumnValue)[];
	number?: number;
	noArt?: boolean;
}

export function ListTrack({ track, number, columns, noArt }: Props) {
	const [infoOpen, setInfoOpen] = useState(false);
	const [playlistOpen, setPlaylistOpen] = useState(false);
	const { createNotification } = useNotificationStore();

	const { queue, currentIndex, isPlaying, toggle } = usePlayerStore();
	const { playNow, playNext, addToEnd } = useQueueActions();
	const nowPlaying = queue[currentIndex];

	const isPlayingThis = useMemo(
		() => nowPlaying == serializeTrackKey(track),
		[nowPlaying, track],
	);

	const title =
		useAttribute(track.attributes, "title", "string") ?? track.title;
	const image = useRawAttribute(track.attributes, "front", "buffer");

	const rightClick = useRightClick(() =>
		[
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
				languageKey: "contextmenu.track.add-to-playlist",
				key: "add-to-playlist",
				onClick: () => setPlaylistOpen(true),
			},
		].filter((e) => !!e),
	);

	const addToPlaylist = (playlist: Playlist) => {
		addTracksToPlaylist(playlist.uuid, {
			tracks: [
				{
					pluginId: track.pluginId,
					libraryId: track.libraryId,
					trackId: track.trackId,
				},
			],
			albums: null,
		})
			.then((response) => {
				// todo: update playlist query key
				createNotification("Started importing track to playlist");
			})
			.catch((e) => {
				console.error(e);
				createNotification("Failed to add track to playlist");
			})
			.finally(() => setPlaylistOpen(false));
	};

	return (
		<>
			<div
				className={cc(styles.container, isPlayingThis && styles.active)}
				{...rightClick}
			>
				<div className={styles.main}>
					<div className={styles.trackNumberContainer}>
						<span className={styles.trackNumber}>{number}</span>
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
					{!noArt && (
						<Link
							className={styles.imageContainer}
							href={`/track/${track.pluginId}/${track.libraryId}/${track.trackId}`}
						>
							<ResourceImage
								resource={image}
								className={styles.cover}
								fallbackSrc="/no_album_art.jpg"
								width={42}
								height={42}
							/>
						</Link>
					)}

					<div className={styles.info}>
						<span className={styles.title}>
							<Link
								href={`/track/${track.pluginId}/${track.libraryId}/${track.trackId}`}
							>
								{title}
							</Link>
						</span>

						{"artists" in track && !!track.artists && (
							<span className={styles.artist}>
								<TrackArtists track={track} />
							</span>
						)}
						{/* {"albums" in track && !!track.albums && (
							<span className={styles.album}>
								<TrackAlbum
									album={track.albums?.[0] ?? null}
									fallback={album}
								/>
							</span>
						)} */}
					</div>
				</div>
				{columns?.map((column, index) => (
					<div
						className={styles.column}
						style={{
							width: `${column.width}px`,
						}}
						key={index}
					>
						{column.type == "special" ? (
							<OptionalLink
								href={column.url}
								className={cc(!!column.url && styles.columnLink)}
							>
								{column.formatted}
							</OptionalLink>
						) : column.attributeType == "buffer" ? (
							<BufferColumn
								column={column as BasicAttributeColumn<"buffer">}
								attributes={track.attributes}
							/>
						) : (
							<ValueColumn
								column={
									column as BasicAttributeColumn<
										Exclude<AttributeUnion["type"], "buffer">
									>
								}
								attributes={track.attributes}
							/>
						)}
					</div>
				))}
			</div>
			{"identities" in track && (
				<TrackInfoModal
					track={track}
					open={infoOpen}
					onClose={() => setInfoOpen(false)}
				/>
			)}
			<PlaylistSelectModal
				open={playlistOpen}
				onClose={() => setPlaylistOpen(false)}
				onSelect={addToPlaylist}
			/>
		</>
	);
}

interface BufferColumnProps {
	column: BasicAttributeColumn<"buffer">;
	attributes: AttributeMap | null;
}

function BufferColumn({ column, attributes }: BufferColumnProps) {
	const attribute = useRawAttribute(
		attributes,
		column.attribute,
		column.attributeType,
	);

	if (!attribute) {
		return null;
	}

	return (
		<Link href={attribute.url} target="_blank">
			<IconButton
				icon={IconExternalLinkFilled}
				iconSource="tabler"
				size="sm"
				style="ghost"
			/>
		</Link>
	);
}

interface ValueColumnProps {
	column: BasicAttributeColumn<Exclude<AttributeUnion["type"], "buffer">>;
	attributes: AttributeMap | null;
}

function ValueColumn({ column, attributes }: ValueColumnProps) {
	const attribute = useAttribute(
		attributes,
		column.attribute,
		column.attributeType,
	);

	return attribute;
}
