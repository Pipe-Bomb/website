"use client";
import Link from "next/link";
import styles from "./navbar.module.scss";
import { useGetAllLibraries } from "@api";
import { List } from "@/components/list/list.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconHome, IconServerCog } from "@tabler/icons-react";

export function Navbar() {
	const libraries = useGetAllLibraries({
		query: {
			enabled: true,
		},
	});

	return (
		<div className={styles.positioner}>
			<div className={styles.container}>
				<div className={styles.main}>
					<div>
						<Link href="/">
							<IconButton icon={IconHome} iconSource="tabler" />
						</Link>
					</div>

					<div>
						<Link href="/artists">Artists</Link>
					</div>
					<div>
						<Link href="/albums">Albums</Link>
					</div>

					<div className={styles.links}>
						<span className={styles.sectionName}>Libraries</span>
						{libraries.data ? (
							<div className={styles.linkList}>
								{libraries.data.data.map((library) => (
									<Link
										href={`/library/${library.pluginId}/${library.id}`}
										key={`${library.pluginId} ${library.id}`}
									>
										{library.name}
									</Link>
								))}
							</div>
						) : (
							<Spinner position="expand" />
						)}
					</div>
				</div>
				<div className={styles.bottom}>
					<Link href="/settings/tasks">
						<IconButton icon={IconServerCog} iconSource="tabler" />
					</Link>
				</div>
			</div>
		</div>
	);
}
