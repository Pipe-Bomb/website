import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import "./theme.css";
import { ReactQueryProvider } from "@/providers/query-client";
import { LanguageProvider } from "@/context/language.context";
import { getLanguageMap, getSelf } from "@api";
import { ContextMenuProvider } from "@/context/context-menu.context";
import { ModalBackground } from "@/components/modal-background/modal-background.component";
import { ModalProvider } from "@/context/modal.context";
import styles from "./layout.module.scss";
import { Player } from "@/components/player/player.component";
import AudioEngine from "@/components/player-engine/player-engine.component";
import { SideBar } from "@/components/sidebar/sidebar.component";
import { Navbar } from "@/components/navbar/navbar.component";
import { cookies } from "next/headers";
import { AuthProvider } from "@/context/auth.context";
import {
	AttributeColumn,
	TrackColumnsProvider,
} from "@/context/track-columns.context";
import localFont from "next/font/local";
import { cc } from "@/lib/util";
import { TopBar } from "@/components/top-bar/top-bar.component";
import { ScrollParentProvider } from "@/context/scroll-parent.context";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const outfit = localFont({
	src: "../font/outfit/Outfit-Variable.woff2",
	variable: "--font-outfit",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Pipe Bomb",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getAuthenticatedUser();
	const res = await getLanguageMap("en_US"); // todo: make this configurable

	const cookieStore = await cookies();
	const trackColumnsCookie = cookieStore.get("track_columns");
	let initialTrackColumns: AttributeColumn[] = [
		{
			attribute: "genre",
			attributeType: "string",
			width: 100,
		},
		{
			attribute: "duration",
			attributeType: "decimal",
			width: 100,
		},
	];

	if (trackColumnsCookie) {
		try {
			initialTrackColumns = JSON.parse(trackColumnsCookie.value);
		} catch {}
	}

	return (
		<html lang="en" className={cc(inter.variable, outfit.variable)}>
			<body>
				<LanguageProvider data={res.data}>
					<AuthProvider user={user}>
						<ContextMenuProvider>
							<TrackColumnsProvider initialColumns={initialTrackColumns}>
								<ModalProvider>
									<ReactQueryProvider>
										<div className={styles.container}>
											<TopBar />
											<div className={styles.body}>
												{user && <Navbar />}
												<ScrollParentProvider
													className={styles.contentPlacement}
												>
													<div className={styles.content}>{children}</div>
												</ScrollParentProvider>

												{user && <SideBar />}
											</div>
											{user && <Player />}
											<AudioEngine />
										</div>
										<ModalBackground />
									</ReactQueryProvider>
								</ModalProvider>
							</TrackColumnsProvider>
						</ContextMenuProvider>
					</AuthProvider>
				</LanguageProvider>
			</body>
		</html>
	);
}

async function getAuthenticatedUser() {
	const cookiesStore = await cookies();
	const token = cookiesStore.get("auth_token")?.value;

	if (!token) {
		return null;
	}

	try {
		const response = await getSelf({
			headers: {
				Authorization: `Bearer ${token}`,
			},
			cache: "no-store",
		});
		if (response.status == 200) {
			return response.data;
		}
		return null;
	} catch {
		return null;
	}
}
