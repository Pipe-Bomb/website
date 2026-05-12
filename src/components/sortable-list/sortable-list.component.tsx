import { ReactNode } from "react";
import { Reorder } from "framer-motion";
import styles from "./sortable-list.module.scss";

interface Props<T> {
	items: T[];
	onOrder: (newItems: T[]) => void;
	renderItem: (item: T) => ReactNode;
	getItemKey: (item: T) => string;
	onSortEnd?: (newItems: T[]) => void;
}

export function SortableList<T>({
	items,
	onOrder,
	renderItem,
	getItemKey,
	onSortEnd,
}: Props<T>) {
	return (
		<Reorder.Group
			axis="y"
			values={items}
			onReorder={onOrder}
			className={styles.container}
			style={{ listStyle: "none", padding: 0, margin: 0 }}
		>
			{items.map((item) => (
				<Reorder.Item
					key={getItemKey(item)}
					value={item}
					className={styles.itemWrapper}
					whileDrag={{
						boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
						opacity: 0.9,
					}}
					onDragEnd={() => onSortEnd?.(items)}
				>
					{renderItem(item)}
				</Reorder.Item>
			))}
		</Reorder.Group>
	);
}
