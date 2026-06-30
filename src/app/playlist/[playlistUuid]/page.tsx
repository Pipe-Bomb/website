import { RootPadding } from "@/components/root-padding/root-padding.component";
import { getAttribute } from "@/lib/attribute.util";
import { getAuthHeaders } from "@/lib/server.util";
import { getPlaylist } from "@api";
import styles from "./page.module.scss";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import Link from "next/link";
import { PlaylistButtons } from "@/components/playlist-buttons/playlist-buttons.component";
import { PlaylistUpdateProgress } from "@/components/playlist-update-progress/playlist-update-progress.component";
import { PlaylistTrackList } from "@/components/playlist-track-list/playlist-track-list.component";
import { Metadata } from "next";
import { PlaylistSmartFilters } from "@/components/playlist-smart-filters/playlist-smart-filters.component";

interface Props {
	params: Promise<{ playlistUuid: string }>;
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata | null> {
	const { playlistUuid } = await params;

	try {
		const headers = await getAuthHeaders();

		const playlistResponse = await getPlaylist(playlistUuid, {
			headers: headers ?? undefined,
		});

		if (playlistResponse.status != 200) {
			return null;
		}

		const playlist = playlistResponse.data;

		const title = getAttribute(playlist.attributes, "title", "string", true);
		const image = getAttribute(playlist.attributes, "thumb", "buffer");

		return {
			title: `${title ?? "Unnamed Playlist"} - Pipe Bomb`,
			openGraph: {
				title: title ?? "Unnamed Playlist",
				description: `Listen to ${title ?? "Unnamed Playlist"} on Pipe Bomb`,
				images: image ? [image.url] : [],
			},
		};
	} catch (e) {
		console.error(e);
	}

	return null;
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
			{!!playlist.filterGroups && (
				<PlaylistSmartFilters
					filterGroups={playlist.filterGroups}
					playlistUuid={playlist.uuid}
				/>
			)}
			{playlist.tracks && (
				<RootPadding>
					<PlaylistTrackList
						initialTracks={playlist.tracks}
						totalCount={playlist.trackCount ?? playlist.tracks.length}
						playlistUuid={playlist.uuid}
						dateModified={playlist.dateModified.toString()}
					/>
				</RootPadding>
			)}
		</div>
	);
}
