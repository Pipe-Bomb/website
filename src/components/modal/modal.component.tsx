"use client";

import { useEffect, useId, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { cc } from "@/lib/util";
import styles from "./modal.module.scss";
import { useModals } from "@/context/modal.context";
import { useIsMounted } from "@/hook/mounted.hook";

export default function Modal({
	children,
	open,
	onClose,
	className,
}: {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: (method: "button" | "background" | "escape") => void;
	className?: string;
}) {
	const { register, unregister } = useModals();
	const id = useId();
	const isMounted = useIsMounted();
	const [shouldRender, setShouldRender] = useState(open);
	const closeRef = useRef(onClose);

	closeRef.current = onClose;

	useEffect(() => {
		if (open) {
			setShouldRender(true);
			register(id, () => closeRef.current?.("background"));
			return () => unregister(id);
		} else {
			const timer = setTimeout(() => setShouldRender(false), 1000);
			return () => clearTimeout(timer);
		}
	}, [open, id, register, unregister]);

	if (!isMounted || !shouldRender) return null;

	return createPortal(
		<div className={cc(styles.container, className, !open && styles.closing)}>
			<button
				className={styles.close}
				onClick={() => closeRef.current?.("button")}
			/>
			<div className={styles.children}>{children}</div>
		</div>,
		document.body,
	);
}
