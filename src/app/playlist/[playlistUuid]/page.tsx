import { RootPadding } from "@/components/root-padding/root-padding.component";
import { TrackList } from "@/components/track-list/track-list.component";
import { getAttribute } from "@/lib/attribute.util";
import { getAuthHeaders } from "@/lib/server.util";
import { getPlaylist, getPlaylistTracks } from "@api";
import styles from "./page.module.scss";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import Link from "next/link";
import { PlaylistButtons } from "@/components/playlist-buttons/playlist-buttons.component";
import { PlaylistUpdateProgress } from "@/components/playlist-update-progress/playlist-update-progress.component";
import { LazyTrackList } from "@/components/track-list/lazy-track-list.component";
import { PlaylistTrackList } from "@/components/playlist-track-list/playlist-track-list.component";

interface Props {
	params: Promise<{ playlistUuid: string }>;
}

export default async function Page({ params }: Props) {
	const { playlistUuid } = await params;

	const headers = await getAuthHeaders();
	if (!headers) {
		return <h1>Not logged in!</h1>;
	}

	const playlistResponse = await getPlaylist(playlistUuid, {
		headers,
	});

	if (playlistResponse.status != 200) {
		return <h1>Not found</h1>;
	}

	const playlist = playlistResponse.data;

	const title = getAttribute(playlist.attributes, "title", "string", true);
	const thumb = getAttribute(playlist.attributes, "thumb", "buffer", false);

	return (
		<div>
			<div className={styles.top}>
				<ResourceImage
					resource={thumb}
					fallbackSrc="/no_album_art.jpg"
					className={styles.coverArt}
					width={240}
					height={240}
				/>
				<div className={styles.topInfo}>
					<h1 className={styles.title}>{title ?? "Unnamed Playlist"}</h1>
					<div>
						<Link
							href={`/user/${playlist.ownerUuid}`}
							className={styles.ownerLink}
						>
							{playlist.owner?.username ?? "Unknown User"}
						</Link>
					</div>
					<div className={styles.topButtons}>
						<PlaylistButtons playlist={playlist} />
					</div>
					<PlaylistUpdateProgress
						playlist={playlist}
						className={styles.updateProgress}
					/>
				</div>
			</div>
			{playlist.tracks && (
				<RootPadding>
					<PlaylistTrackList
						initialTracks={playlist.tracks}
						totalCount={playlist.trackCount ?? playlist.tracks.length}
						playlistUuid={playlist.uuid}
					/>
				</RootPadding>
			)}
		</div>
	);
}
