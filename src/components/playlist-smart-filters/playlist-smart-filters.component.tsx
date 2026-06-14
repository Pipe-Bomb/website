"use client";

import {
	addPlaylistSmartFilterGroup,
	addPlaylistSmartFilterGroupResponse,
	deletePlaylistSmartFilterGroup,
	SmartPlaylistFilterGroup,
	updatePlaylistSmartFilterGroup,
} from "@api";
import styles from "./playlist-smart-filters.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlusFilled } from "@tabler/icons-react";
import { CreateFilterGroupModal } from "@/modal/create-filter-group/create-filter-group.modal";
import { useEffect, useMemo, useState } from "react";
import { SmartFilterDto } from "@/interface/smart-filter.dto";
import { Button } from "@/components/button/button.component";
import { RootPadding } from "@/components/root-padding/root-padding.component";
import { usePathname, useRouter } from "next/navigation";

interface Props {
	filterGroups: SmartPlaylistFilterGroup[];
	playlistUuid: string;
}

export function PlaylistSmartFilters({ filterGroups, playlistUuid }: Props) {
	const router = useRouter();
	const pathname = usePathname();

	const [isOpen, setIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

	const activeGroup = useMemo(() => {
		if (!activeGroupId) {
			return null;
		}
		return filterGroups.find((group) => group.uuid == activeGroupId) ?? null;
	}, [activeGroupId, filterGroups]);

	useEffect(() => {
		if (!isOpen) {
			setActiveGroupId(null);
		}
	}, [isOpen]);

	const save = (groupId: string | null, filters: SmartFilterDto[]) => {
		if (isSaving || isDeleting) {
			return;
		}
		setIsSaving(true);

		let callback: Promise<addPlaylistSmartFilterGroupResponse>;

		if (groupId) {
			callback = updatePlaylistSmartFilterGroup(playlistUuid, groupId, {
				filters,
			});
		} else {
			callback = addPlaylistSmartFilterGroup(playlistUuid, { filters });
		}

		callback
			.then(() => {
				setIsOpen(false);
				if (pathname == `/playlist/${playlistUuid}`) {
					router.refresh();
				}
			})
			.catch(console.error)
			.finally(() => setIsSaving(false));
	};

	const remove = (groupId: string) => {
		if (isSaving || isDeleting) {
			return;
		}
		setIsDeleting(true);

		deletePlaylistSmartFilterGroup(playlistUuid, groupId)
			.then(() => {
				setIsOpen(false);
				if (pathname == `/playlist/${playlistUuid}`) {
					router.refresh();
				}
			})
			.catch(console.error)
			.finally(() => setIsDeleting(false));
	};

	return (
		<>
			<RootPadding className={styles.rowContainer}>
				{filterGroups.map((group) => (
					<Button
						key={group.uuid}
						style="secondary"
						onClick={() => {
							setActiveGroupId(group.uuid);
							setIsOpen(true);
						}}
					>
						{group.filters.length} filters
					</Button>
				))}
				<IconButton
					icon={IconPlusFilled}
					iconSource="tabler"
					onClick={() => setIsOpen(true)}
				/>
			</RootPadding>
			<CreateFilterGroupModal
				existingGroup={activeGroup}
				open={isOpen}
				onClose={() => setIsOpen(false)}
				isSaving={isSaving}
				isDeleting={isDeleting}
				onSave={(filters) => save(activeGroup?.uuid ?? null, filters)}
				onDelete={() => activeGroup && remove(activeGroup.uuid)}
			/>
		</>
	);
}
