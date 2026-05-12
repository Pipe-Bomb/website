"use client";

import { useModals } from "@/context/modal.context";
import styles from "./modal-background.module.scss";
import { cc } from "@/lib/util";

export function ModalBackground() {
	const { activeCount, closeTop } = useModals();

	return (
		<div
			className={cc(styles.background, activeCount > 0 && styles.open)}
			onClick={closeTop}
		/>
	);
}
