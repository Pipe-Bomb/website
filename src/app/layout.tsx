import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "./theme.css";
import { ReactQueryProvider } from "@/providers/query-client";
import { LanguageProvider } from "@/context/language.context";
import { getLanguageMap } from "@api";
import { ContextMenuProvider } from "@/context/context-menu.context";
import { ModalBackground } from "@/components/modal-background/modal-background.component";
import { ModalProvider } from "@/context/modal.context";
import styles from "./layout.module.scss";
import { Player } from "@/components/player/player.component";
import AudioEngine from "@/components/player-engine/player-engine.component";
import { SideBar } from "@/components/sidebar/sidebar.component";
import { Navbar } from "@/components/navbar/navbar.component";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Pipe Bomb",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const res = await getLanguageMap("en_US"); // todo: make this configurable

	return (
		<html lang="en" className={`${inter.variable}`}>
			<body>
				<LanguageProvider data={res.data}>
					<ContextMenuProvider>
						<ModalProvider>
							<ReactQueryProvider>
								<div className={styles.container}>
									<div className={styles.body}>
										<Navbar />
										<div className={styles.contentPlacement}>
											<div className={styles.content}>{children}</div>
										</div>
										<SideBar />
									</div>
									<Player />
									<AudioEngine />
								</div>
								<ModalBackground />
							</ReactQueryProvider>
						</ModalProvider>
					</ContextMenuProvider>
				</LanguageProvider>
			</body>
		</html>
	);
}
