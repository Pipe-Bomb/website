"use client";

import { useAuth } from "@/context/auth.context";
import styles from "./top-bar.module.scss";
import { IconSearch, IconUserCircle } from "@tabler/icons-react";
import { TextInput } from "@/components/text-input/text-input.component";
import { useUrlParam } from "@/hook/url-param.hook";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { IconButton } from "@/components/icon-button/icon-button";
import { useKeyboardShortcuts } from "@/hook/keyboard-shortcuts.hook";
import { useState } from "react";
import { useButtonMenu } from "@/hook/button-menu.hook";
import { logoutUser } from "@api";

export function TopBar() {
	const user = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);

	const [query, setQuery] = useUrlParam("query", {
		replace: true,
		debounceMs: 300,
	});

	useKeyboardShortcuts(
		(key, _shift, ctrl) => {
			if (key == "k" && ctrl) {
				if (searchInput) {
					searchInput.focus();
				}
				return true;
			}
			return false;
		},
		[searchInput],
	);

	const changeQuery = (newQuery: string) => {
		if (pathname != "/search" && newQuery.trim() != "") {
			router.push(`/search?query=${newQuery}`);
		}

		setQuery(newQuery);
	};

	const { onClick } = useButtonMenu(() => [
		{
			key: "logout",
			languageKey: "contextmenu.top.logout",
			onClick: () => {
				logoutUser().then((response) => {
					router.refresh();
				});
			},
		},
	]);

	return (
		<div className={styles.container}>
			<div className={styles.buttons}>
				<Link href="/" className={styles.homeButton}>
					<img src="/logo.png" className={styles.homeButtonLogo} />
				</Link>
			</div>
			<div className={styles.search}>
				<div className={styles.searchBox}>
					<TextInput
						value={query ?? ""}
						onChange={changeQuery}
						placeholder="Search..."
						ref={setSearchInput}
					/>
				</div>

				<IconButton
					icon={IconSearch}
					iconSource="tabler"
					onClick={() => router.push("/search")}
					iconClassName={styles.searchIcon}
				/>
			</div>
			{user && (
				<button className={styles.userSection} onClick={onClick}>
					<IconUserCircle className={styles.userIcon} />
					<span className={styles.username}>{user.username}</span>
				</button>
			)}
		</div>
	);
}
