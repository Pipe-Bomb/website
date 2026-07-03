import { getAttribute } from "@/lib/attribute.util";
import { getTrack, getTrackExternalUrls } from "@api";
import styles from "./page.module.scss";
import { ResourceImage } from "@/components/resource-image/resource-image.component";
import { TrackArtists } from "@/components/track-artists/track-artists.component";
import { TrackButtons } from "@/components/track-buttons/track-buttons.component";
import { ExternalUrlList } from "@/components/external-url-list/external-url-list.component";

interface Props {
	params: Promise<{
		pluginId: string;
		libraryId: string;
		trackId: string;
	}>;
}

export default async function Page({ params }: Props) {
	const { pluginId, libraryId, trackId } = await params;

	const trackResponse = await getTrack(pluginId, libraryId, trackId);

	if (trackResponse.status != 200 || !trackResponse.data) {
		return <h1>Something went wrong</h1>;
	}

	const track = trackResponse.data;

	const title =
		getAttribute(track.attributes, "title", "string", true) ?? track.title;
	const front = getAttribute(track.attributes, "front", "buffer");

	const trackUrlsResponse = await getTrackExternalUrls(
		pluginId,
		libraryId,
		trackId,
	);

	return (
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
						<TrackArtists track={track} />
					</div>
					<div className={styles.topButtons}>
						<TrackButtons track={track} />
					</div>
				</div>
			</div>
			<div className={styles.split}>
				<div className={styles.main}></div>
				<div className={styles.sidebar}>
					{trackUrlsResponse.status == 200 &&
						!!trackUrlsResponse.data.length && (
							<div>
								<ExternalUrlList urls={trackUrlsResponse.data} />
							</div>
						)}
				</div>
			</div>
		</div>
	);
}
