"use client";

import { usePlayerStore } from "@/store/player.store";
import { Track } from "@api";
import styles from "./track-buttons.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { useMemo } from "react";
import { ListEndIcon, ListStartIcon } from "lucide-react";

interface Props {
	track: Track;
}

export function TrackButtons({ track }: Props) {
	const { playTrack, insert, addToEnd, currentIndex } = usePlayerStore();

	const [play, playNext, playEnd] = useMemo(() => {
		return [
			() => playTrack(track, 0),
			() => insert([track], currentIndex + 1),
			() => addToEnd([track]),
		];
	}, [track, playTrack, currentIndex]);

	return (
		<div className={styles.container}>
			<IconButton
				size="xl"
				style="background"
				icon={IconPlayerPlayFilled}
				iconSource="tabler"
				onClick={play}
			/>
			<IconButton
				size="md"
				icon={ListStartIcon}
				iconSource="lucide"
				onClick={playNext}
			/>
			<IconButton
				size="md"
				icon={ListEndIcon}
				iconSource="lucide"
				onClick={playEnd}
			/>
		</div>
	);
}
