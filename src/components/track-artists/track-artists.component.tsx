import { useAttribute } from "@/hook/attribute.hook";
import { cc } from "@/lib/util";
import { Artist, Track } from "@api/model";
import Link from "next/link";
import { Fragment } from "react/jsx-runtime";
import styles from "./track-artists.module.scss";

interface Props {
	track: Track;
}

export function TrackArtists({ track }: Props) {
	const rawArtists = useAttribute(track.attributes, "artist", "string", true);

	if (track.artists?.length) {
		return (
			<>
				{track.artists.map(({ artist, joinPhrase }, index) => (
					<Fragment key={artist.uuid}>
						<ArtistLink artist={artist} />
						{index < track.artists!.length - 1 && (
							<span className={styles.artistJoin}>{joinPhrase ?? ", "}</span>
						)}
					</Fragment>
				))}
			</>
		);
	}

	if (rawArtists?.length) {
		return (
			<>
				{rawArtists.map((artist, index) => (
					<Fragment key={index}>
						<span className={styles.artistName}>{artist}</span>
						{index < rawArtists!.length - 1 && (
							<span className={styles.artistJoin}>, </span>
						)}
					</Fragment>
				))}
			</>
		);
	}

	return <span className={styles.artistName}>Unknown Artist</span>;
}

interface ArtistLinkProps {
	artist: Artist;
}

function ArtistLink({ artist }: ArtistLinkProps) {
	const name = useAttribute(artist.attributes, "name", "string", false);

	return (
		<Link
			href={`/artist/${artist.uuid}`}
			className={cc(styles.artistName, styles.artistLink)}
		>
			{name ?? "Unknown Artist"}
		</Link>
	);
}
