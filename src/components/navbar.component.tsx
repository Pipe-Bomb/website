import Image from "next/image";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import styles from "./navbar.module.scss";

export function Navbar() {
	return (
		<nav className={styles.nav}>
			<a href="/" className={styles.brand}>
				<Image
					src="/logo.png"
					alt="Pipe Bomb"
					width={28}
					height={28}
					className={styles.logoMark}
				/>
				<span className={styles.wordmark}>PIPE BOMB</span>
			</a>
			<div className={styles.links}>
				<a
					href="https://demo.pipebomb.net"
					className={styles.demoLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					Try demo <IconArrowUpRight size={14} stroke={2} />
				</a>
				<a
					href="https://github.com/Pipe-Bomb/docker"
					className={styles.githubLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					<IconBrandGithub size={16} stroke={1.5} /> GitHub
				</a>
			</div>
		</nav>
	);
}
