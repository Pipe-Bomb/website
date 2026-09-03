"use client";

import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import styles from "./wiki-shell.module.scss";

export function WikiShell({
	sidebar,
	children,
}: {
	sidebar: React.ReactNode;
	children: React.ReactNode;
}) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className={styles.shell}>
			<div
				className={`${styles.sidebarWrap}${sidebarOpen ? ` ${styles.open}` : ""}`}
			>
				{sidebar}
			</div>
			{sidebarOpen && (
				<div
					className={styles.overlay}
					onClick={() => setSidebarOpen(false)}
					aria-hidden
				/>
			)}
			<div className={styles.contentWrap}>
				<button
					className={styles.mobileToggle}
					onClick={() => setSidebarOpen((o) => !o)}
					aria-label="Toggle navigation"
				>
					{sidebarOpen ? (
						<IconX size={18} stroke={1.5} />
					) : (
						<IconMenu2 size={18} stroke={1.5} />
					)}
					<span>{sidebarOpen ? "Close" : "Navigation"}</span>
				</button>
				{children}
			</div>
		</div>
	);
}
