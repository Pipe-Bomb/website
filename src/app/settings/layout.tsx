import { ReactNode } from "react";
import styles from "./layout.module.scss";
import Link from "next/link";

interface Props {
	children: ReactNode;
}

export default function Layout({ children }: Props) {
	return (
		<div className={styles.container}>
			<div className={styles.sideBar}>
				<div className={styles.tabs}>
					<Link href="/settings/libraries">Libraries</Link>
					<Link href="/settings/attribute-sources">Attribute Sources</Link>
					<Link href="/settings/identifiers">Identifiers</Link>
					<Link href="/settings/tasks">Tasks</Link>
				</div>
			</div>
			<div className={styles.content}>{children}</div>
		</div>
	);
}
