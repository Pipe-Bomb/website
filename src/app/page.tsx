import Image from "next/image";
import {
	IconAdjustments,
	IconArrowRight,
	IconArrowUpRight,
	IconBolt,
	IconCast,
	IconDatabase,
	IconDeviceMobile,
	IconFolderOpen,
	IconInfinity,
	IconPhoto,
	IconPlaylist,
	IconPuzzle,
	IconSearch,
	IconSparkles,
	IconUsers,
	IconWifi,
} from "@tabler/icons-react";
import styles from "./page.module.scss";
import Link from "next/link";

const CAPABILITIES = [
	{
		Icon: IconWifi,
		label: "Stream your music library to any browser, no plugins required",
	},
	{
		Icon: IconPuzzle,
		label: "Plugin system - extend capabilities without forking",
	},
	{
		Icon: IconAdjustments,
		label: "Attribute schema fully defined by your plugins",
	},
	{
		Icon: IconSearch,
		label: "Search your local library or query an external source",
	},
	{ Icon: IconPlaylist, label: "Smart playlists with a real filter engine" },
	{ Icon: IconUsers, label: "Multi-user support with configurable privileges" },
	{
		Icon: IconBolt,
		label: "Chain tasks together and automate data pipelines with Workflows",
	},
	{
		Icon: IconInfinity,
		label: "Playlists are library-independent - mix tracks from any source",
	},
];

const PLUGINS: {
	Icon: React.ComponentType<{
		className?: string;
		size?: number;
		stroke?: number;
	}>;
	name: string;
	badge: "Official" | "Community";
	desc: string;
	url: string;
}[] = [
	{
		Icon: IconDatabase,
		name: "MusicBrainz",
		badge: "Official",
		desc: "Automatically enrich your library with metadata from MusicBrainz.",
		url: "https://github.com/Pipe-Bomb/musicbrainz-plugin",
	},
	{
		Icon: IconFolderOpen,
		name: "Local Library",
		badge: "Official",
		desc: "Import music from any directory on your server.",
		url: "https://github.com/pipe-bomb/local-library-plugin",
	},
	{
		Icon: IconPhoto,
		name: "Discogs",
		badge: "Official",
		desc: "Pull artist artwork and logos.",
		url: "https://github.com/Pipe-Bomb/discogs-plugin",
	},
	{
		Icon: IconCast,
		name: "DLNA Server",
		badge: "Community",
		desc: "Expose your Pipe Bomb library to any DLNA-compatible player on your network.",
		url: "https://github.com/pipe-bomb-community/dlna-plugin",
	},
	{
		Icon: IconDeviceMobile,
		name: "OpenSubsonic",
		badge: "Community",
		desc: "Full OpenSubsonic API compatibility - use Feishin, Symfonium, or any Subsonic client.",
		url: "https://github.com/eyezahhhh/open-subsonic-plugin",
	},
	{
		Icon: IconSparkles,
		name: "Playlist Cover Art",
		badge: "Community",
		desc: "Auto-generate cover art for your playlists based on their contents.",
		url: "https://github.com/eyezahhhh/playlist-cover-art-plugin",
	},
];

export default function Page() {
	return (
		<>
			<section className={styles.hero}>
				<div className={styles.heroInner}>
					<h1 className={styles.heroHeading}>
						Dangerously good at handling your music
					</h1>
					<p className={styles.heroSub}>
						Self-hosted streaming on hardware you own. No schema assumptions.
						Extendable with plugins.
					</p>
					<div className={styles.heroCtas}>
						<a
							href="https://github.com/Pipe-Bomb/docker"
							className={styles.ctaPrimary}
							target="_blank"
							rel="noopener noreferrer"
						>
							Get started <IconArrowRight size={16} stroke={2.5} />
						</a>
						<a
							href="https://demo.pipebomb.net"
							className={styles.ctaGhost}
							target="_blank"
							rel="noopener noreferrer"
						>
							Try the demo <IconArrowUpRight size={16} stroke={2} />
						</a>
					</div>
				</div>
				<div className={styles.heroArt} aria-hidden>
					<Image
						src="/logo.png"
						alt=""
						width={540}
						height={540}
						loading="eager"
					/>
				</div>
			</section>

			<section className={styles.pitch}>
				<div className={styles.pitchInner}>
					<p className={styles.pitchText}>
						Pipe Bomb runs on your hardware and streams to any browser. Nothing
						leaves your infrastructure. You run the server, you control the
						data, and the client gives you an experience indistinguishable from
						a first-class streaming app.
					</p>
					<p className={styles.pitchText}>
						The plugin system defines everything the server knows about your
						library. Metadata schemas, external catalogs, identifiers, streaming
						behaviours - all determined by plugins. If you can write a plugin,
						you can make Pipe Bomb speak your catalog&apos;s language exactly.
					</p>
				</div>
			</section>

			<section className={styles.uiPreview}>
				<div className={styles.uiPreviewInner}>
					<div className={styles.uiPreviewHeader}>
						<p className={styles.uiPreviewLabel}>Client</p>
						<h2 className={styles.uiPreviewHeading}>
							An experience worth using
						</h2>
						<p className={styles.uiPreviewSub}>
							Built to handle tens of thousands of tracks, Pipe Bomb is designed
							to grow with your library without compromising on the experience.
						</p>
					</div>
					<div className={styles.screenshotFrame}>
						<div className={styles.screenshotChrome}>
							<span className={styles.screenshotDot} />
							<span className={styles.screenshotDot} />
							<span className={styles.screenshotDot} />
						</div>
						<div className={styles.screenshotBody}>
							<Image
								width={1748}
								height={1037}
								src="/screenshot.jpeg"
								alt="Screenshot of Pipe Bomb frontend"
								className={styles.screenshot}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* FEATURES */}
			<section className={styles.features}>
				<div className={styles.featuresInner}>
					<div className={styles.featuresGrid}>
						<div className={styles.featureLarge}>
							<div className={styles.featureLabel}>Plugin system</div>
							<h2 className={styles.featureHeading}>
								Add capabilities without forking
							</h2>
							<p className={styles.featureBody}>
								External catalogs, identifiers, metadata sources, streaming
								behaviors - everything the server knows is defined by plugins.
								Install community plugins or write your own. Pipe Bomb doesn't
								assume what your library should look like.
							</p>
						</div>
						<div className={styles.featuresRight}>
							<div className={styles.featureSmall}>
								<div className={styles.featureLabel}>Attribute schema</div>
								<h3 className={styles.featureHeadingSm}>
									No hardcoded metadata fields
								</h3>
								<p className={styles.featureBodySm}>
									Plugins define what a track, album, artist, or playlist looks
									like. The platform adapts to your catalog, not the other way
									around.
								</p>
							</div>
							<div className={styles.featureSmall}>
								<div className={styles.featureLabel}>App-quality client</div>
								<h3 className={styles.featureHeadingSm}>
									Self-hosted doesn&apos;t mean worse
								</h3>
								<p className={styles.featureBodySm}>
									Virtualized lists, smooth transitions. The client is built to
									feel like a well-funded streaming product.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* PLUGIN SHOWCASE */}
			<section className={styles.pluginShowcase}>
				<div className={styles.pluginShowcaseInner}>
					<p className={styles.pluginShowcaseLabel}>Plugins</p>
					<h2 className={styles.pluginShowcaseHeading}>Extend everything</h2>
					<p className={styles.pluginShowcaseSub}>
						Official and community plugins define what Pipe Bomb knows about
						your library. Browse plugin marketplaces and install with one click
						from within the client.
					</p>
					<div className={styles.pluginGrid}>
						{PLUGINS.map(({ Icon, name, badge, desc, url }) => (
							<div key={name} className={styles.pluginCard}>
								<Icon className={styles.pluginIcon} size={24} stroke={1.5} />
								<div className={styles.pluginMeta}>
									<Link
										className={styles.pluginName}
										href={url}
										target="_blank"
									>
										{name}
									</Link>
									<span
										className={
											badge === "Official"
												? styles.pluginBadgeOfficial
												: styles.pluginBadgeCommunity
										}
									>
										{badge}
									</span>
								</div>
								<p className={styles.pluginDesc}>{desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className={styles.capabilities}>
				<div className={styles.capabilitiesInner}>
					<h2 className={styles.capabilitiesHeading}>What it does</h2>
					<ol className={styles.capabilitiesList}>
						{CAPABILITIES.map(({ Icon, label }, i) => (
							<li key={i} className={styles.capabilityItem}>
								<Icon
									className={styles.capabilityIcon}
									size={20}
									stroke={1.5}
								/>
								<span className={styles.capabilityText}>{label}</span>
							</li>
						))}
					</ol>
				</div>
			</section>

			<section className={styles.gettingStarted}>
				<div className={styles.gsInner}>
					<h2 className={styles.gsHeading}>Get started in seconds</h2>
					<p className={styles.gsSub}>
						With Docker Compose, a single command gets you up and running.
					</p>
					<div className={styles.codeBlock}>
						<span className={styles.codePrompt}>$</span>
						<code className={styles.codeText}>docker compose up -d</code>
					</div>
					<p className={styles.gsNote}>
						<a
							href="https://github.com/Pipe-Bomb/docker"
							className={styles.gsLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							Full setup guide <IconArrowUpRight size={14} stroke={2} />
						</a>
					</p>
				</div>
			</section>

			<section className={styles.cta}>
				<div className={styles.ctaInner}>
					<p className={styles.ctaNote}>Open source with zero lock in</p>
					<h2 className={styles.ctaHeading}>Run it yourself.</h2>
					<div className={styles.ctaActions}>
						<a
							href="https://github.com/Pipe-Bomb/docker"
							className={styles.ctaPrimary}
							target="_blank"
							rel="noopener noreferrer"
						>
							Clone on GitHub <IconArrowRight size={16} stroke={2.5} />
						</a>
						<a
							href="https://github.com/Pipe-Bomb"
							className={styles.ctaGhost}
							target="_blank"
							rel="noopener noreferrer"
						>
							Browse the org <IconArrowUpRight size={16} stroke={2} />
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
