import { useAttribute } from "@/hook/attribute.hook";
import { Track } from "@api/model";
import { FormattedArtists } from "@/components/formatted-artists/formatted-artists.component";

interface Props {
	track: Track;
}

export function TrackArtists({ track }: Props) {
	const rawArtists = useAttribute(track.attributes, "artist", "string", true);

	return <FormattedArtists artists={track.artists} fallback={rawArtists} />;
}
