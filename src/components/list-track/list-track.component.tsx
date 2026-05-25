"use client";

import { AttributeMap, BufferAttribute, EphemeralTrack, Track } from "@api";
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
import { AttributeColumn } from "@/context/track-columns.context";
import { useRawAttribute } from "@/hook/raw-attribute.hook";
import { AttributeUnion } from "@/lib/attribute.util";

interface Props {
	track: Track | EphemeralTrack;
	columns?: AttributeColumn[];
	number?: number;
	noArt?: boolean;
}

export function ListTrack({ track, number, columns, noArt }: Props) {
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
			"identifiers" in track && {
				languageKey: "contextmenu.track.view-info",
				key: "view-info",
				onClick: () => setInfoOpen(true),
			},
		].filter((e) => !!e),
	);

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
						<div className={styles.imageContainer}>
							<ResourceImage
								resource={image}
								className={styles.cover}
								fallbackSrc="/no_album_art.jpg"
								width={42}
								height={42}
							/>
						</div>
					)}

					<div className={styles.info}>
						<span className={styles.title}>
							<Link
								href={`/track/${track.pluginId}/${track.libraryId}/${track.id}`}
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
						{column.attributeType == "buffer" ? (
							<BufferColumn
								column={column as AttributeColumn<"buffer">}
								attributes={track.attributes}
							/>
						) : (
							<ValueColumn
								column={
									column as AttributeColumn<
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
		</>
	);
}

interface BufferColumnProps {
	column: AttributeColumn<"buffer">;
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
			Link
		</Link>
	);
}

interface ValueColumnProps {
	column: AttributeColumn<Exclude<AttributeUnion["type"], "buffer">>;
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
