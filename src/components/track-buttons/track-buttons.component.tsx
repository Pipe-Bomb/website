"use client";

import { Track } from "@api";
import styles from "./track-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { ListEndIcon, ListStartIcon } from "lucide-react";
import { useQueueActions } from "@/hook/queue-actions.hook";

interface Props {
	track: Track;
}

export function TrackButtons({ track }: Props) {
	const { playNow, playNext, addToEnd } = useQueueActions();

	return (
		<div className={styles.container}>
			<IconButton
				size="xl"
				style="background"
				icon={IconPlayerPlayFilled}
				iconSource="tabler"
				onClick={() => playNow(track)}
			/>
			<IconButton
				size="md"
				icon={ListStartIcon}
				iconSource="lucide"
				onClick={() => playNext(track)}
			/>
			<IconButton
				size="md"
				icon={ListEndIcon}
				iconSource="lucide"
				onClick={() => addToEnd([track])}
			/>
		</div>
	);
}
