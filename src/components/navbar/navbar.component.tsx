"use client";
import Link from "next/link";
import styles from "./navbar.module.scss";
import { useGetAllLibraries } from "@api";
import { Spinner } from "@/components/spinner/spinner.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconDisc, IconServerCog, IconUser } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { NavbarLink } from "@/components/navbar-link/navbar-link.component";

export function Navbar() {
	const libraries = useGetAllLibraries({
		query: {
			enabled: true,
		},
	});
	const pathname = usePathname();

	return (
		<div className={styles.positioner}>
			<div className={styles.container}>
				<div className={styles.main}>
					<div>
						<NavbarLink
							href="/artists"
							name="Artists"
							active={pathname == "/artists"}
							icon={IconUser}
						/>
						<NavbarLink
							href="/albums"
							name="Albums"
							active={pathname == "/albums"}
							icon={IconDisc}
						/>
					</div>

					<div>
						<span className={styles.sectionName}>Libraries</span>
						{libraries.data ? (
							<div className={styles.linkList}>
								{libraries.data.data.map((library) => (
									<NavbarLink
										href={`/library/${library.pluginId}/${library.id}`}
										key={`${library.pluginId} ${library.id}`}
										active={
											pathname == `/library/${library.pluginId}/${library.id}`
										}
										name={library.name}
									/>
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
