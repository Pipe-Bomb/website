import { AlbumArtist, Artist, TrackArtist } from "@api";
import { Fragment } from "react/jsx-runtime";
import styles from "./formatted-artists.module.scss";
import { useAttribute } from "@/hook/attribute.hook";
import Link from "next/link";
import { cc } from "@/lib/util";
import { useMemo } from "react";

interface Props {
	artists: (TrackArtist | AlbumArtist)[] | null;
	fallback?: string[] | null;
}

export function FormattedArtists({ artists, fallback }: Props) {
	if (artists?.length) {
		return (
			<>
				{artists.map(({ artist, joinPhrase }, index) => (
					<Fragment key={artist.uuid ?? index}>
						<ArtistLink artist={artist} />
						{index < artists!.length - 1 && (
							<span className={styles.artistJoin}>{joinPhrase ?? ", "}</span>
						)}
					</Fragment>
				))}
			</>
		);
	}

	if (fallback?.length) {
		return (
			<>
				{fallback.map((artist, index) => (
					<Fragment key={index}>
						<span className={styles.artistName}>{artist}</span>
						{index < fallback!.length - 1 && (
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

	const url = useMemo(() => {
		if (artist.uuid) {
			return `/artist/${artist.uuid}`;
		}
		if (artist.identities?.length) {
			const identity = artist.identities[0];
			return `/artist/${identity.pluginId}~${identity.identityId}~${identity.value}`;
		}
		return null;
	}, [artist]);

	if (url) {
		return (
			<Link href={url} className={cc(styles.artistName, styles.artistLink)}>
				{name ?? "Unknown Artist"}
			</Link>
		);
	}

	return <span className={styles.artistName}>{name ?? "Unknown Artist"}</span>;
}
