import { GridAlbum } from "@/components/grid-album/grid-album.component";
import { GridArtist } from "@/components/grid-artist/grid-artist.component";
import { Grid } from "@/components/grid/grid.component";
import { ListTrack } from "@/components/list-track/list-track.component";
import { List } from "@/components/list/list.component";
import { Album, Artist, EphemeralTrack, Track } from "@api";
import { useMemo } from "react";
import styles from "./search-results.module.scss";

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
					<List>
						{topTracks.map((track) => (
							<ListTrack
								track={track}
								key={`${track.pluginId} ${track.libraryId} ${track.id}`}
							/>
						))}
					</List>
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
					<List>
						{remainingTracks.map((track) => (
							<ListTrack
								track={track}
								key={`${track.pluginId} ${track.libraryId} ${track.id}`}
							/>
						))}
					</List>
				</div>
			)}
		</div>
	);
}
