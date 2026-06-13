"use client";

import { cc } from "@/lib/util";
import styles from "./dropdown.module.scss";
import { useMemo } from "react";
import { useTranslation } from "@/context/language.context";
import { IconChevronDownFilled } from "@tabler/icons-react";

export type DropdownEntry = {
	key: string;
} & (
	| {
			t: string;
			content?: string;
	  }
	| {
			content: string;
	  }
);

interface Props {
	entries: DropdownEntry[];
	selected: string | null;
	open?: boolean;
	onToggle?: (shouldOpen: boolean) => void;
	onChange?: (entry: DropdownEntry) => void;
	className?: string;
}

export function Dropdown({
	entries,
	selected,
	open,
	onToggle,
	onChange,
	className,
}: Props) {
	const { t } = useTranslation();

	const activeEntry = useMemo(() => {
		return entries.find((entry) => entry.key === selected) ?? null;
	}, [entries, selected]);

	return (
		<span className={cc(styles.container, className, open && styles.open)}>
			<div className={styles.flex}>
				<button className={styles.top} onClick={() => onToggle?.(!open)}>
					{activeEntry
						? "t" in activeEntry
							? t(activeEntry.t, activeEntry.content)
							: activeEntry.content
						: "Select"}
					<IconChevronDownFilled className={styles.arrow} />
				</button>
				<div className={styles.optionsContainer}>
					<div className={styles.optionsSize}>
						<div className={styles.options}>
							{entries.map((entry) => (
								<button
									key={entry.key}
									onClick={() => onChange?.(entry)}
									className={styles.option}
								>
									<span>
										{"t" in entry ? t(entry.t, entry.content) : entry.content}
									</span>
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</span>
	);
}
