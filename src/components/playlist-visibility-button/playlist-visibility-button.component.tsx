"use client";

import {
	IconButton,
	IconComponent,
} from "@/components/icon-button/icon-button";
import { PlaylistVisibilityModal } from "@/modal/playlist-visibility/playlist-visibility.modal";
import { Playlist, PlaylistVisibility } from "@api";
import { IconLock, IconLockOpen, IconLockShare } from "@tabler/icons-react";
import { useState } from "react";
import styles from "./playlist-visibility-button.module.scss";

interface Props {
	playlist: Playlist;
}

const VISIBILITY_ICONS: Record<PlaylistVisibility, IconComponent> = {
	[PlaylistVisibility.private]: IconLock,
	[PlaylistVisibility.unlisted]: IconLockShare,
	[PlaylistVisibility.public]: IconLockOpen,
};

export function PlaylistVisibilityButton({ playlist }: Props) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<IconButton
				icon={VISIBILITY_ICONS[playlist.visibility]}
				iconSource="tabler"
				style="ghost"
				onClick={() => setOpen(true)}
				size="sm"
				iconClassName={styles.icon}
			/>
			<PlaylistVisibilityModal
				playlist={playlist}
				open={open}
				onClose={() => setOpen(false)}
			/>
		</>
	);
}
