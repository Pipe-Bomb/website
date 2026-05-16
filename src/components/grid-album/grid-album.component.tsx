"use client";

import { useAttribute } from "@/hook/attribute.hook";
import { Album } from "@api/model";
import styles from "./grid-album.module.scss";
import Link from "next/link";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { useRightClick } from "@/hook/right-click.hook";
import { useState } from "react";
import { AlbumArtists } from "@/components/album-artists/album-artists.component";

interface Props {
	album: Album;
}

export function GridAlbum({ album }: Props) {
	const [infoOpen, setInfoOpen] = useState(false);

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
			<Link className={styles.imageContainer} href={`/album/${album.uuid}`}>
				<ResourceImage
					resource={front}
					className={styles.image}
					fallbackSrc="/no_album_art.jpg"
				/>
			</Link>
			<Link href={`/album/${album.uuid}`} className={styles.name}>
				{title ?? "Unknown Album"}
			</Link>
			<span className={styles.artists}>
				<AlbumArtists album={album} />
			</span>
		</div>
	);
}
