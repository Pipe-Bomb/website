import { useAttribute } from "@/hook/attribute.hook";
import { cc } from "@/lib/util";
import Link from "next/link";
import { Album } from "pipe-bomb-tanstack-client";
import styles from "./track-album.module.scss";

interface Props {
	album: Album | null;
	fallback?: string | null;
}

export function TrackAlbum({ album, fallback }: Props) {
	const title = useAttribute(album?.attributes ?? null, "title", "string");

	if (title) {
		return (
			<Link
				href={`/album/${album!.uuid}`}
				className={cc(styles.title, styles.link)}
			>
				{title}
			</Link>
		);
	}

	if (fallback) {
		return <span className={styles.title}>{fallback}</span>;
	}

	return null;
}
