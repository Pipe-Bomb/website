import { useAttribute } from "@/hook/attribute.hook";
import { Album } from "@api";
import { FormattedArtists } from "@/components/formatted-artists/formatted-artists.component";

interface Props {
	album: Album;
}

export function AlbumArtists({ album }: Props) {
	const rawArtists = useAttribute(album.attributes, "artist", "string", true);

	return <FormattedArtists artists={album.artists} fallback={rawArtists} />;
}
