"use client";
import Link from "next/link";
import styles from "./navbar.module.scss";
import { logoutUser, useGetAllLibraries } from "@api";
import { Spinner } from "@/components/spinner/spinner.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconHome, IconServerCog } from "@tabler/icons-react";
import { useAuth } from "@/context/auth.context";
import { Button } from "@/components/button/button.component";
import { useRouter } from "next/navigation";

export function Navbar() {
	const user = useAuth();
	const router = useRouter();

	const libraries = useGetAllLibraries({
		query: {
			enabled: true,
		},
	});

	const logout = () => {
		logoutUser()
			.then(() => {
				router.refresh();
			})
			.catch((e) => console.error(e));
	};

	return (
		<div className={styles.positioner}>
			<div className={styles.container}>
				<div className={styles.main}>
					{user && (
						<div>
							<span>{user.username}</span>
							<Button style="secondary" onClick={logout}>
								Log Out
							</Button>
						</div>
					)}
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
