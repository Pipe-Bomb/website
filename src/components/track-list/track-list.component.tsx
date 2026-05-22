import {
	ListTrack,
	ListTrackColumn,
} from "@/components/list-track/list-track.component";
import { List } from "@/components/list/list.component";
import { EphemeralTrack, Track } from "@api";

interface Props {
	tracks: (Track | EphemeralTrack)[];
	keyGenerator?: (track: Track | EphemeralTrack) => string | number;
	trackNumber?: (track: Track | EphemeralTrack, index: number) => number;
}

export function TrackList({ tracks, keyGenerator, trackNumber }: Props) {
	const columns: ListTrackColumn[] = [
		{
			attribute: "genre",
			attributeType: "string",
			width: 100,
		},
	];

	return (
		<div>
			<List>
				{tracks.map((track, index) => (
					<ListTrack
						track={track}
						key={
							keyGenerator
								? keyGenerator(track)
								: `${track.pluginId} ${track.libraryId} ${track.id}`
						}
						columns={columns}
						number={trackNumber?.(track, index)}
					/>
				))}
			</List>
		</div>
	);
}
