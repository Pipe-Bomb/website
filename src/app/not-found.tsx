import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
	return (
		<div className={styles.page}>
			<span className={styles.code}>404</span>
			<h1 className={styles.heading}>Page not found</h1>
			<p className={styles.body}>
				This page doesn&apos;t exist or has been moved.
			</p>
			<Link href="/" className={styles.link}>
				Go home
			</Link>
		</div>
	);
}
