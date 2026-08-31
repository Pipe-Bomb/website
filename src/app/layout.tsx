import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./theme.css";
import "./globals.scss";
import styles from "./layout.module.scss";
import { cc } from "@/lib/util";
import { Navbar } from "@/components/navbar.component";
import { IconHeart } from "@tabler/icons-react";
import Link from "next/link";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const outfit = localFont({
	src: "../font/outfit/Outfit-Variable.woff2",
	variable: "--font-outfit",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Pipe Bomb - Self-hosted music streaming",
	description:
		"Pipe Bomb is a self-hosted music streaming platform with a plugin system, flexible attribute schema, and an app-quality client. Run your music library on hardware you own.",
	openGraph: {
		title: "Pipe Bomb - Self-hosted music streaming",
		description:
			"A self-hosted music streaming platform with a plugin system, flexible attribute schema, and an app-quality client.",
		images: [
			{
				width: 1748,
				height: 1037,
				url: "https://pipebomb.net/screenshot.jpeg",
				alt: "Screenshot of Pipe Bomb frontend",
			},
		],
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={cc(inter.variable, outfit.variable)}>
			<body>
				<div className={styles.container}>
					<Navbar />
					{children}
					<footer className={styles.footer}>
						<div className={styles.footerInner}>
							<span className={styles.footerBrand}>
								<span>Pipe Bomb made with</span>
								<IconHeart />
								<span>by</span>
								<Link href="https://eyezah.com" target="_blank">
									eyezah
								</Link>
							</span>
							<div className={styles.footerLinks}>
								<a
									href="https://github.com/Pipe-Bomb/server"
									target="_blank"
									rel="noopener noreferrer"
								>
									Server
								</a>
								<a
									href="https://github.com/Pipe-Bomb/frontend"
									target="_blank"
									rel="noopener noreferrer"
								>
									Client
								</a>
							</div>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
