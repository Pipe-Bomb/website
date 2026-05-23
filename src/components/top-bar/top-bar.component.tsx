"use client";

import { useAuth } from "@/context/auth.context";
import styles from "./top-bar.module.scss";
import { IconUserCircle } from "@tabler/icons-react";
import { TextInput } from "@/components/text-input/text-input.component";
import { useUrlParam } from "@/hook/url-param.hook";
import { usePathname, useRouter } from "next/navigation";
import { IconButton } from "@/components/icon-button/icon-button";
import Link from "next/link";

export function TopBar() {
	const user = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	const [query, setQuery] = useUrlParam("query", {
		replace: true,
		debounceMs: 300,
	});

	const changeQuery = (newQuery: string) => {
		if (pathname != "/search" && newQuery.trim() != "") {
			console.log("PUSHING ROUTER");
			router.push(`/search?query=${newQuery}`);
		}

		setQuery(newQuery);
	};

	return (
		<div className={styles.container}>
			<div className={styles.buttons}>
				<Link href="/" className={styles.homeButton}>
					<img src="/logo.png" className={styles.homeButtonLogo} />
				</Link>
			</div>
			<div className={styles.search}>
				<TextInput
					value={query ?? ""}
					onChange={changeQuery}
					placeholder="Search..."
				/>
			</div>
			{user && (
				<div className={styles.userSection}>
					<IconUserCircle className={styles.userIcon} />
					<span className={styles.username}>{user.username}</span>
				</div>
			)}
		</div>
	);
}
