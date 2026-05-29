import { EphemeralTrack, Track } from "@/api";
import { ListTrack } from "@/components/list-track/list-track.component";
import { BaseTrackList } from "@/components/track-list/base-track-list.component";

interface Props {
	tracks: (Track | EphemeralTrack)[];
	trackNumbers?: number[];
	noArt?: boolean;
}

export function TrackList({ tracks, trackNumbers, noArt }: Props) {
	return (
		<BaseTrackList
			totalCount={tracks.length}
			itemContent={(index, columns) => (
				<ListTrack
					track={tracks[index]}
					columns={columns}
					number={trackNumbers?.[index]}
					noArt={noArt}
				/>
			)}
		/>
	);
}
