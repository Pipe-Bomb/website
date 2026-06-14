import { useAttributeFilterDescription } from "@/hook/attribute-filter-description.hook";
import { SmartFilterDto } from "@/interface/smart-filter.dto";
import styles from "./smart-filter-list-entry.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import {
	IconDisc,
	IconEdit,
	IconMusic,
	IconUserCircle,
	ReactNode,
} from "@tabler/icons-react";

interface Props {
	filter: SmartFilterDto;
	onEdit: () => void;
}

export function SmartFilterListEntry({ filter, onEdit }: Props) {
	const description = useAttributeFilterDescription(filter)!;

	const icon: Record<"track" | "artist" | "album", () => ReactNode> = {
		artist: () => <IconUserCircle />,
		track: () => <IconMusic />,
		album: () => <IconDisc />,
	};

	filter.entityType;

	return (
		<div className={styles.container}>
			{icon[filter.entityType]()}
			<span className={styles.description}>{description}</span>
			<IconButton
				icon={IconEdit}
				iconSource="tabler"
				size="sm"
				onClick={onEdit}
			/>
		</div>
	);
}
