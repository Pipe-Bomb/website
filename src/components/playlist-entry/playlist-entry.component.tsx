import { useAttribute } from "@/hook/attribute.hook";
import { Playlist } from "@api";
import styles from "./playlist-entry.module.scss";
import { useRawAttribute } from "@/hook/raw-attribute.hook";

interface Props {
	playlist: Playlist;
	onClick?: () => void;
}

export function PlaylistEntry({ playlist, onClick }: Props) {
	const title = useAttribute(playlist.attributes, "title", "string");
	const thumb = useRawAttribute(playlist.attributes, "thumb", "buffer");

	return (
		<button className={styles.container} onClick={onClick}>
			<div className={styles.thumbContainer}>
				<img
					src={thumb ? `${thumb.url}?width=32&height=32` : "/no_album_art.jpg"}
					className={styles.thumb}
				/>
			</div>
			<span className={styles.title}>{title ?? "Unnamed Playlist"}</span>
		</button>
	);
}
