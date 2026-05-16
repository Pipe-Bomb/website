import { useAttribute } from "@/hook/attribute.hook";
import { Artist } from "@api/model";
import styles from "./grid-artist.module.scss";
import Link from "next/link";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { useRightClick } from "@/hook/right-click.hook";
import { ArtistInfoModal } from "@/components/artist-info-modal/artist-info-modal.component";
import { useState } from "react";

interface Props {
	artist: Artist;
}

export function GridArtist({ artist }: Props) {
	const [infoOpen, setInfoOpen] = useState(false);

	const name = useAttribute(artist.attributes, "name", "string");
	const thumbnail = useAttribute(artist.attributes, "thumb", "buffer");

	const rightClick = useRightClick(() => [
		{
			languageKey: "contextmenu.artist.view-info",
			key: "view-info",
			onClick: () => setInfoOpen(true),
		},
	]);

	return (
		<>
			<Link
				className={styles.container}
				href={`/artist/${artist.uuid}`}
				{...rightClick}
			>
				<div className={styles.imageContainer}>
					<ResourceImage resource={thumbnail} className={styles.image} />
				</div>
				<span className={styles.name}>{name ?? "Unknown Artist"}</span>
			</Link>
			<ArtistInfoModal
				artist={artist}
				open={infoOpen}
				onClose={() => setInfoOpen(false)}
			/>
		</>
	);
}
