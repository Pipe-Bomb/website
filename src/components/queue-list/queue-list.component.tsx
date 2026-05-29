"use client";

import { QueueTrack } from "@/components/queue-track/queue-track.component";
import { useScrollParentContext } from "@/context/scroll-parent.context";
import { useTrack } from "@/hook/track.hook";
import { usePlayerStore } from "@/store/player.store";
import { Virtuoso } from "react-virtuoso";
import styles from "./queue-list.module.scss";
import { QueueTrackSkeleton } from "@/components/queue-track/queue-track-skeleton.component";

export function QueueList() {
	const queue = usePlayerStore((state) => state.queue);

	const { scrollParent } = useScrollParentContext();

	return (
		<Virtuoso
			className={styles.container}
			customScrollParent={scrollParent}
			totalCount={queue.length}
			itemContent={(index) => {
				const trackKey = queue[index];

				return <Row trackKey={trackKey} index={index} />;
			}}
		/>
	);
}

interface RowProps {
	trackKey: string;
	index: number;
}

function Row({ trackKey, index }: RowProps) {
	const trackResult = useTrack(trackKey);

	if (!trackResult.data) {
		return <QueueTrackSkeleton queueIndex={index} />;
	}

	return <QueueTrack track={trackResult.data} queueIndex={index} />;
}
