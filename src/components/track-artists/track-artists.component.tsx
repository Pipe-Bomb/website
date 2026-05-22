import { useAttribute } from "@/hook/attribute.hook";
import { EphemeralTrack, Track } from "@api";
import { FormattedArtists } from "@/components/formatted-artists/formatted-artists.component";

interface Props {
	track: Track | EphemeralTrack;
}

export function TrackArtists({ track }: Props) {
	const rawArtists = useAttribute(track.attributes, "artist", "string", true);

	return <FormattedArtists artists={track.artists} fallback={rawArtists} />;
}
