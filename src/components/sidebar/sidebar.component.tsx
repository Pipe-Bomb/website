"use client";

import { cc } from "@/lib/util";
import styles from "./sidebar.module.scss";
import { useSidebarStore } from "@/store/sidebar.store";
import { usePlayerStore } from "@/store/player.store";
import { QueueList } from "@/components/queue-list/queue-list.component";
import { ScrollParentProvider } from "@/context/scroll-parent.context";

export function SideBar() {
	const { open } = useSidebarStore();
	const { queue } = usePlayerStore();

	return (
		<div className={cc(styles.positioner, open && styles.open)}>
			<div className={styles.container}>
				<ScrollParentProvider className={styles.queue}>
					<QueueList />
				</ScrollParentProvider>
			</div>
		</div>
	);
}
