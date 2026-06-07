import { getAttribute } from "@/lib/attribute.util";
import { getAlbumExternalUrls } from "@api";
import styles from "./page.module.scss";
import { ExternalUrlList } from "@/components/external-url-list/external-url-list.component";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { AlbumArtists } from "@/components/album-artists/album-artists.component";
import { AlbumButtons } from "@/components/album-buttons/album-buttons.component";
import { TrackList } from "@/components/track-list/track-list.component";
import { getAlbumById } from "@/lib/api.util";
import { AlbumEphemeralContentTabs } from "@/components/ephemeral-content-tabs/album-ephemeral-content-tabs.component";
import { RootPadding } from "@/components/root-padding/root-padding.component";
import { TrackListProvider } from "@/context/tracklist.context";
import { Metadata } from "next";

interface Props {
	params: Promise<{
		albumId: string;
	}>;
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata | null> {
	const { albumId } = await params;

	try {
		const albumResponse = await getAlbumById(albumId);

		if (albumResponse.status != 200) {
			return null;
		}

		const album = albumResponse.data;

		const title = getAttribute(album.attributes, "title", "string", true);
		const image = getAttribute(album.attributes, "front", "buffer");

		let artistString = "";

		if (album.artists?.length) {
			for (const [index, artist] of album.artists.entries()) {
				const name = getAttribute(
					artist.artist.attributes,
					"name",
					"string",
					true,
				);
				artistString += name || "Unknown Artist";
				if (artist.joinPhrase) {
					artistString += artist.joinPhrase;
				} else if (index < album.artists.length - 1) {
					artistString += ", ";
				}
			}
		}

		return {
			title: `${title ?? "Unknown Album"} - Pipe Bomb`,
			openGraph: {
				title: title ?? "Unknown Album",
				description: `Listen to ${title ?? "Unknown Album"}${artistString ? ` by ${artistString}` : ""} on Pipe Bomb`,
				images: image ? [image.url] : [],
			},
		};
	} catch {}

	return null;
}

export default async function Page({ params }: Props) {
	const { albumId } = await params;

	const albumResponse = await getAlbumById(albumId);

	if (albumResponse.status == 404) {
		return <h1>Album not found</h1>;
	}

	const album = albumResponse.data;
	const title =
		getAttribute(album.attributes, "title", "string", true) ?? "Unknown Album";
	const front = getAttribute(album.attributes, "front", "buffer");

	const albumUrlsResponse =
		(!!album.uuid && (await getAlbumExternalUrls(album.uuid))) || null;

	return (
		<TrackListProvider>
			<div>
				<div className={styles.top}>
					<ResourceImage
						resource={front}
						fallbackSrc="/no_album_art.jpg"
						className={styles.coverArt}
						width={240}
						height={240}
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
				<RootPadding className={styles.split}>
					<div className={styles.main}>
						{!!album.tracks?.length && (
							<TrackList
								tracks={album.tracks}
								trackNumbers={album.tracks.map((_, index) => index + 1)}
								noArt
							/>
						)}
					</div>
					<div className={styles.sidebar}>
						{albumUrlsResponse?.status == 200 &&
							!!albumUrlsResponse.data.length && (
								<div>
									<ExternalUrlList urls={albumUrlsResponse.data} />
								</div>
							)}
					</div>
				</RootPadding>
				<RootPadding>
					<AlbumEphemeralContentTabs albumId={albumId} />
				</RootPadding>
			</div>
		</TrackListProvider>
	);
}
