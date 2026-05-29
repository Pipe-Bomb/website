"use client";

import { RequireAuth } from "@/guard/auth.guard";
import styles from "./page.module.scss";

export default function Home() {
	return (
		<RequireAuth>
			<h1 className={styles.title}>Welcome to Pipe Bomb</h1>
		</RequireAuth>
	);
}
