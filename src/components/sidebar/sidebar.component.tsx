"use client";

import { cc } from "@/lib/util";
import styles from "./sidebar.module.scss";
import { useSidebarStore } from "@/store/sidebar.store";
import { usePlayerStore } from "@/store/player.store";
import { QueueTrack } from "@/components/queue-track/queue-track.component";
import { SortableList } from "@/components/sortable-list/sortable-list.component";
import { Track } from "@api";

export function SideBar() {
	const { open } = useSidebarStore();
	const { queue } = usePlayerStore();

	return (
		<div className={cc(styles.positioner, open && styles.open)}>
			<div className={styles.container}>
				<div className={styles.queue}>
					<SortableList
						items={queue.map(
							(entry, index) => [entry, index] as [Track, number],
						)}
						renderItem={([track, index]) => (
							<QueueTrack track={track} queueIndex={index} />
						)}
						getItemKey={([_track, index]) => `${index}`}
						onOrder={() => {}}
					/>
				</div>
			</div>
		</div>
	);
}
