"use client";

import { useAttribute } from "@/hook/attribute.hook";
import { Album } from "@api";
import styles from "./grid-album.module.scss";
import Link from "next/link";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { useRightClick } from "@/hook/right-click.hook";
import { useMemo, useState } from "react";
import { AlbumArtists } from "@/components/album-artists/album-artists.component";
import { OptionalLink } from "@/components/optional-link/optional-link.component";

interface Props {
	album: Album;
}

export function GridAlbum({ album }: Props) {
	const [infoOpen, setInfoOpen] = useState(false);

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
	const front = useAttribute(album.attributes, "front", "buffer");

	const rightClick = useRightClick(() => [
		{
			languageKey: "contextmenu.album.view-info",
			key: "view-info",
			onClick: () => setInfoOpen(true),
		},
	]);

	return (
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
	);
}
