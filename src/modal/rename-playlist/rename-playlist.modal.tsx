"use client";

import { Modal } from "@/components/modal/modal.component";
import { useRawAttribute } from "@/hook/raw-attribute.hook";
import { Playlist } from "@api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./rename-playlist.module.scss";
import { TextInput } from "@/components/text-input/text-input.component";
import { Button } from "@/components/button/button.component";

interface Props extends InnerProps {
	open: boolean;
	onClose?: () => void;
}

export function RenamePlaylistModal({ open, onClose, playlist }: Props) {
	return (
		<Modal open={open} onClose={onClose}>
			<Inner playlist={playlist} />
		</Modal>
	);
}

interface InnerProps {
	playlist: Playlist;
}

function Inner({ playlist }: InnerProps) {
	const router = useRouter();
	const [isRenaming, setIsRenaming] = useState(false);
	const initialName = useRawAttribute(playlist.attributes, "title", "string");
	const [title, setTitle] = useState(initialName ?? "");

	const rename = () => {
		if (isRenaming || !title.trim()) {
			return;
		}

		setIsRenaming(true);
	};

	return (
		<div className={styles.container}>
			<TextInput
				value={title}
				onChange={setTitle}
				placeholder="Playlist Title"
				autoFocus
				onEnter={rename}
				disabled={isRenaming}
			/>
			<Button onClick={rename} loading={isRenaming}>
				Rename
			</Button>
		</div>
	);
}
