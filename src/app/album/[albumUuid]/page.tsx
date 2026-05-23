import { ListTrack } from "@/components/list-track/list-track.component";
import { List } from "@/components/list/list.component";
import { getAttribute } from "@/lib/attribute.util";
import { getAlbumExternalUrls } from "@api";
import styles from "./page.module.scss";
import { ExternalUrlList } from "@/components/external-url-list/external-url-list.component";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { AlbumArtists } from "@/components/album-artists/album-artists.component";
import { AlbumButtons } from "@/components/album-buttons/album-buttons.component";
import { getAlbumById } from "@/lib/api.util";

interface Props {
	params: Promise<{
		albumUuid: string;
	}>;
}

export default async function Page({ params }: Props) {
	const { albumUuid } = await params;

	const albumResponse = await getAlbumById(albumUuid);

	if (albumResponse.status == 404) {
		return <h1>Album not found</h1>;
	}

	const album = albumResponse.data;
	const title =
		getAttribute(album.attributes, "title", "string") ?? "Unknown Album";
	const front = getAttribute(album.attributes, "front", "buffer");

	const albumUrlsResponse =
		(!!album.uuid && (await getAlbumExternalUrls(album.uuid))) || null;

	return (
		<div>
			<div className={styles.top}>
				<ResourceImage
					resource={front}
					fallbackSrc="/no_album_art.jpg"
					className={styles.coverArt}
				/>
				<div className={styles.topInfo}>
					<h1 className={styles.title}>{title}</h1>
					<div className={styles.artists}>
						<AlbumArtists album={album} />
					</div>
					<div className={styles.topButtons}>
						<AlbumButtons album={album} />
					</div>
				</div>
			</div>
			<div className={styles.split}>
				<div className={styles.main}>
					<List>
						{album.tracks?.map((track) => (
							<ListTrack track={track} key={track.id} />
						))}
					</List>
				</div>
				<div className={styles.sidebar}>
					{albumUrlsResponse?.status == 200 &&
						!!albumUrlsResponse.data.length && (
							<div>
								<ExternalUrlList urls={albumUrlsResponse.data} />
							</div>
						)}
				</div>
			</div>
		</div>
	);
}
