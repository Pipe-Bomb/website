import { GridAlbum } from "@/components/grid-album/grid-album.component";
import { GridArtist } from "@/components/grid-artist/grid-artist.component";
import { Grid } from "@/components/grid/grid.component";
import { ListTrack } from "@/components/list-track/list-track.component";
import { List } from "@/components/list/list.component";
import { Album, Artist, EphemeralTrack, Track } from "@api";
import { useMemo } from "react";
import styles from "./search-results.module.scss";
import { TrackList } from "@/components/track-list/track-list.component";

interface Props {
	tracks: (Track | EphemeralTrack)[];
	artists: Artist[];
	albums: Album[];
}

export function SearchResults({ tracks, artists, albums }: Props) {
	const [topTracks, remainingTracks] = useMemo(() => {
		return [tracks.slice(0, 5), tracks.slice(5)];
	}, [tracks]);

	if (!tracks.length && !artists.length && !albums.length) {
		return <h1>No results</h1>;
	}

	return (
		<div className={styles.container}>
			{!!topTracks.length && (
				<div>
					<h3 className={styles.sectionTitle}>Top Tracks</h3>
					<TrackList
						tracks={topTracks}
						trackNumber={(_track, index) => index + 1}
					/>
				</div>
			)}
			{!!artists.length && (
				<div>
					<h3 className={styles.sectionTitle}>Artists</h3>
					<Grid>
						{artists.map((artist) => (
							<GridArtist artist={artist} key={artist.uuid} />
						))}
					</Grid>
				</div>
			)}
			{!!albums.length && (
				<div>
					<h3 className={styles.sectionTitle}>Albums</h3>
					<Grid>
						{albums.map((album) => (
							<GridAlbum album={album} key={album.uuid} />
						))}
					</Grid>
				</div>
			)}
			{!!remainingTracks.length && (
				<div>
					<h3 className={styles.sectionTitle}>Tracks</h3>
					<TrackList
						tracks={remainingTracks}
						trackNumber={(_track, index) => index + topTracks.length + 1}
					/>
				</div>
			)}
		</div>
	);
}
