import { ListTrack } from "@/components/list-track/list-track.component";
import { getAttribute } from "@/lib/attribute.util";
import { getArtist, getArtistExternalUrls } from "@api";
import styles from "./page.module.scss";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
	params: Promise<{
		artistUuid: string;
	}>;
}

export async function generateMetadata({
	params,
}: Props): Promise<Metadata | null> {
	const { artistUuid } = await params;

	const artistResponse = await getArtist(artistUuid);

	if (artistResponse.status != 200) {
		return null;
	}

	const artist = artistResponse.data;

	const name = getAttribute(artist.attributes, "name", "string");
	// const image =
	// 	getAttribute(artist.attributes, "background", "buffer") ??
	// 	getAttribute(artist.attributes, "thumb", "buffer");

	return {
		title: `${name ?? "Unknown Artist"} - Pipe Bomb`,
		// openGraph: {
		// 	images: image ? [`http://127.0.0.1:3000${image.url}`] : [],
		// },
	};
}

export default async function Page({ params }: Props) {
	const { artistUuid } = await params;

	const artistResponse = await getArtist(artistUuid);

	if (artistResponse.status == 404) {
		return <h1>Artist not found</h1>;
	}

	const artist = artistResponse.data;

	const artistUrlsResponse = await getArtistExternalUrls(artist.uuid);

	const name = getAttribute(artist.attributes, "name", "string");
	const thumbnail = getAttribute(artist.attributes, "thumb", "buffer");
	const background = getAttribute(artist.attributes, "background", "buffer");
	const logo = getAttribute(artist.attributes, "logo", "buffer");
	const genres = getAttribute(artist.attributes, "genre", "string", true);

	return (
		<div className={styles.container}>
			<div className={styles.backgroundContainer}>
				<ResourceImage
					resource={background}
					className={styles.backgroundImage}
				/>
			</div>
			<div className={styles.aboveBackground}>
				<ResourceImage resource={logo} className={styles.logo} />
			</div>
			<div className={styles.body}>
				<div className={styles.top}>
					{thumbnail && (
						<div className={styles.thumbnailContainer}>
							<ResourceImage resource={thumbnail} />
						</div>
					)}

					<div className={styles.topContent}>
						<h1 className={styles.artistName}>{name ?? "Unknown Artist"}</h1>
						{!!genres?.length && (
							<div className={styles.genres}>
								{genres.map((genre, index) => (
									<Link
										href={`/genre/${genre}`}
										key={index}
										className={styles.genre}
									>
										{genre}
									</Link>
								))}
							</div>
						)}
					</div>
				</div>

				<div className={styles.split}>
					<div className={styles.trackList}>
						<h3>Tracks</h3>
						<div>
							{artist.tracks?.map((track) => (
								<ListTrack
									track={track}
									key={`${track.pluginId} ${track.libraryId} ${track.id}`}
								/>
							))}
						</div>
					</div>
					<div className={styles.sideBar}>
						{artistUrlsResponse.status == 200 &&
							!!artistUrlsResponse.data.length && (
								<div>
									<h3>External Urls</h3>
									{artistUrlsResponse.data.map((url, index) => (
										<div key={index} className={styles.externalUrl}>
											<img
												className={styles.externalUrlImage}
												src={`http://127.0.0.1:3000${url.iconUrl}`}
											/>
											<Link
												href={url.url}
												target="_blank"
												className={styles.externalUrlLink}
											>
												{url.name}
											</Link>
										</div>
									))}
								</div>
							)}
					</div>
				</div>
			</div>
		</div>
	);
}
