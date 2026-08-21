import {
	getGetPlaylistMembersQueryKey,
	PlaylistMember,
	PlaylistMemberRole,
	removePlaylistMember,
	upsertPlaylistMember,
} from "@/api";
import { useNotificationStore } from "@/store/notification.store";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./playlist-collaborator-entry.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconTrash } from "@tabler/icons-react";
import { Checkbox } from "@/components/checkbox/checkbox.component";
import { Spinner } from "@/components/spinner/spinner.component";

interface Props {
	member: PlaylistMember;
	playlistUuid: string;
}

export function PlaylistCollaboratorEntry({ member, playlistUuid }: Props) {
	const { createNotification } = useNotificationStore();
	const queryClient = useQueryClient();
	const [isSaving, setIsSaving] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);

	const changeRole = async (canEdit: boolean) => {
		setIsSaving(true);
		try {
			const role = canEdit
				? PlaylistMemberRole.collaborator
				: PlaylistMemberRole.viewer;
			await upsertPlaylistMember(playlistUuid, member.userUuid, { role });
			await queryClient.invalidateQueries({
				queryKey: getGetPlaylistMembersQueryKey(playlistUuid),
			});
		} catch {
			createNotification("Failed to update member role");
		} finally {
			setIsSaving(false);
		}
	};

	const remove = async () => {
		setIsRemoving(true);
		try {
			await removePlaylistMember(playlistUuid, member.userUuid);
			await queryClient.invalidateQueries({
				queryKey: getGetPlaylistMembersQueryKey(playlistUuid),
			});
		} catch {
			createNotification("Failed to remove member");
		} finally {
			setIsRemoving(false);
		}
	};

	return (
		<div className={styles.container}>
			<span className={styles.name}>
				{member.user?.username ?? member.userUuid}
			</span>
			<div className={styles.controls}>
				<span className={styles.label}>Can edit</span>
				<div className={styles.checkboxContainer}>
					{isSaving ? (
						<Spinner size="xs" position="expand" />
					) : (
						<Checkbox
							checked={member.role === PlaylistMemberRole.collaborator}
							onChange={changeRole}
							disabled={isRemoving}
						/>
					)}
				</div>
			</div>
			<IconButton
				icon={IconTrash}
				iconSource="tabler"
				style="ghost"
				onClick={remove}
				loading={isRemoving}
				disabled={isSaving || isRemoving}
			/>
		</div>
	);
}
