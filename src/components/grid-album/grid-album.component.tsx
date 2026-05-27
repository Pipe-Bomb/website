"use client";

import { useAttribute } from "@/hook/attribute.hook";
import { addTracksToPlaylist, Album, Playlist } from "@api";
import styles from "./grid-album.module.scss";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { useRightClick } from "@/hook/right-click.hook";
import { useMemo, useState } from "react";
import { AlbumArtists } from "@/components/album-artists/album-artists.component";
import { OptionalLink } from "@/components/optional-link/optional-link.component";
import { useRawAttribute } from "@/hook/raw-attribute.hook";
import { PlaylistSelectModal } from "@/modal/playlist-select/playlist-select.modal";
import { getAlbumById } from "@/lib/api.util";

interface Props {
	album: Album;
}

export function GridAlbum({ album }: Props) {
	const [infoOpen, setInfoOpen] = useState(false);
	const [playlistOpen, setPlaylistOpen] = useState(false);
	const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);

	const link = useMemo(() => {
		if (album.uuid) {
			return `/album/${album.uuid}`;
		}
		if (album.identities?.length) {
			const identity = album.identities[0];
			return `/album/${identity.pluginId}~${identity.identityId}~${identity.value}`;
		}
		return null;
	}, [album]);

	const title = useAttribute(album.attributes, "title", "string");
	const front = useRawAttribute(album.attributes, "front", "buffer");

	const rightClick = useRightClick(() => [
		{
			languageKey: "contextmenu.album.view-info",
			key: "view-info",
			onClick: () => setInfoOpen(true),
		},
		{
			languageKey: "contextmenu.album.add-to-playlist",
			key: "add-to-playlist",
			onClick: () => setPlaylistOpen(true),
		},
	]);

	const addToPlaylist = (playlist: Playlist) => {
		if (isAddingToPlaylist) {
			return;
		}
		let albumId: string;
		if (album.uuid) {
			albumId = album.uuid;
		} else if (album.identities && album.identities.length > 0) {
			const identity = album.identities[0];
			albumId = `${identity.pluginId}~${identity.identityId}~${identity.value}`;
		} else {
			return;
		}
		setIsAddingToPlaylist(true);

		getAlbumById(albumId)
			.then((response) => {
				if (response.status == 200) {
					const tracklist = response.data.tracks;
					if (tracklist?.length) {
						return addTracksToPlaylist(playlist.uuid, {
							tracks: tracklist.map((track) => ({
								pluginId: track.pluginId,
								libraryId: track.libraryId,
								trackId: track.id,
							})),
						});
					}
				}
			})
			.then((response) => {
				setIsAddingToPlaylist(false);
				if (response?.status == 200) {
					setPlaylistOpen(false);
				}
			});
	};

	return (
		<>
			<div className={styles.container} {...rightClick}>
				<OptionalLink className={styles.imageContainer} href={link}>
					<ResourceImage
						resource={front}
						className={styles.image}
						fallbackSrc="/no_album_art.jpg"
						width={180}
						height={180}
					/>
				</OptionalLink>
				<OptionalLink href={link} className={styles.name}>
					{title ?? "Unknown Album"}
				</OptionalLink>
				<span className={styles.artists}>
					<AlbumArtists album={album} />
				</span>
			</div>
			<PlaylistSelectModal
				open={playlistOpen}
				onClose={() => !isAddingToPlaylist && setPlaylistOpen(false)}
				onSelect={addToPlaylist}
			/>
		</>
	);
}
