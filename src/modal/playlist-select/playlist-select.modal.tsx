import { Button } from "@/components/button/button.component";
import { Modal } from "@/components/modal/modal.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { useAttribute } from "@/hook/attribute.hook";
import { Playlist, useGetOwnPlaylists } from "@api";
import styles from "./playlist-select.module.scss";

interface Props extends InnerProps {
	open: boolean;
	onClose?: () => void;
}

export function PlaylistSelectModal({ open, onClose, onSelect }: Props) {
	return (
		<Modal open={open} onClose={onClose}>
			<Inner onSelect={onSelect} />
		</Modal>
	);
}

interface InnerProps {
	onSelect?: (playlist: Playlist) => void;
}

function Inner({ onSelect }: InnerProps) {
	const playlistsQuery = useGetOwnPlaylists({
		query: {
			enabled: true,
		},
	});

	if (
		playlistsQuery.isPending ||
		!playlistsQuery.data ||
		playlistsQuery.data.status != 200
	) {
		return <Spinner />;
	}

	const playlists = playlistsQuery.data.data;

	return (
		<div className={styles.container}>
			{playlists.map((playlist) => (
				<PlaylistEntry
					playlist={playlist}
					key={playlist.uuid}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
}

interface PlaylistEntryProps extends InnerProps {
	playlist: Playlist;
}

function PlaylistEntry({ playlist, onSelect }: PlaylistEntryProps) {
	const title = useAttribute(playlist.attributes, "title", "string");

	return (
		<Button style="secondary" onClick={() => onSelect?.(playlist)}>
			{title ?? "Unnamed Playlist"}
		</Button>
	);
}
