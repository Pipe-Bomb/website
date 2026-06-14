import { useAttributeFilterDescription } from "@/hook/attribute-filter-description.hook";
import { SmartFilterDto } from "@/interface/smart-filter.dto";
import styles from "./smart-filter-list-entry.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconEdit } from "@tabler/icons-react";

interface Props {
	filter: SmartFilterDto;
	onEdit: () => void;
}

export function SmartFilterListEntry({ filter, onEdit }: Props) {
	const description = useAttributeFilterDescription(filter)!;

	return (
		<div className={styles.container}>
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
