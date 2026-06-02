"use client";

import { usePlayerStore } from "@/store/player.store";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { createTrackAudioSession } from "@api";
import { useNotificationStore } from "@/store/notification.store";
import { useKeyboardShortcuts } from "@/hook/keyboard-shortcuts.hook";
import { useTrack } from "@/hook/track.hook";
import { getAttribute } from "@/lib/attribute.util";

export default function AudioEngine() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const hlsRef = useRef<Hls | null>(null);
	const { createNotification, removeNotification } = useNotificationStore();
	const [failedNotificationId, setFailedNotificationId] = useState<
		string | null
	>(null);

	const {
		queue,
		currentIndex,
		isPlaying,
		next,
		prev,
		seek,
		seekTo,
		updateProgress,
		setIsPlaying,
		toggle,

		setIsBuffering,
	} = usePlayerStore();

	useKeyboardShortcuts((key, shift) => {
		if (key === " ") {
			toggle();
			return true;
		}
		if (key == "ArrowRight") {
			if (shift) {
				next();
			} else {
				seek((current) => current + 10);
			}
			return true;
		}
		if (key == "ArrowLeft") {
			if (shift) {
				prev();
			} else {
				seek((current) => current - 10);
			}
			return true;
		}

		const numberIndex = "0123456789".indexOf(key);
		if (key.length == 1 && numberIndex >= 0) {
			seek((_current, duration) => (duration / 10) * numberIndex);
			return true;
		}

		return false;
	}, []);

	const currentTrack = queue[currentIndex];
	const trackResult = useTrack(currentTrack);

	useEffect(() => {
		if (!("mediaSession" in navigator) || !trackResult.data) {
			return;
		}

		const track = trackResult.data;
		const title = getAttribute(track.attributes, "title", "string", true);
		let artistString = "";

		if (track.artists?.length) {
			for (const [index, artist] of track.artists.entries()) {
				const name = getAttribute(
					artist.artist.attributes,
					"name",
					"string",
					true,
				);
				if (name) {
					artistString += name;
					if (artist.joinPhrase) {
						artistString += artist.joinPhrase;
					} else if (index < track.artists.length - 1) {
						artistString += ", ";
					}
				}
			}
		}
		if (!artistString) {
			const attribute = getAttribute(
				track.attributes,
				"artist",
				"string",
				true,
				true,
			);
			if (attribute?.length) {
				artistString = attribute.join(", ");
			}
		}

		navigator.mediaSession.metadata = new MediaMetadata({
			title: title ?? track.title,
			artist: artistString || "Unknown Artist",
		});
	}, [trackResult.data]);

	useEffect(() => {
		if (failedNotificationId) {
			return () => {
				removeNotification(failedNotificationId);
			};
		}
	}, [failedNotificationId]);

	useEffect(() => {
		setFailedNotificationId(null);
	}, [currentTrack]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentTrack) return;

		let cancelled = false;

		if (hlsRef.current) {
			hlsRef.current.destroy();
			hlsRef.current = null;
		}

		audio.src = "";

		setIsBuffering(true);

		createTrackAudioSession(
			...(currentTrack.split(":") as [string, string, string]),
		)
			.then(({ data: session }) => {
				if (cancelled || !audio || !session) return;

				if (session.type === "stream") {
					audio.src = `${session.baseUrl}/stream`;
					audio.load();
					audio.play();
				}

				if (session.type === "hls") {
					const url = `${session.baseUrl}/hls/playlist.m3u8`;

					if (audio.canPlayType("application/vnd.apple.mpegurl")) {
						audio.src = url;
						audio.load();
						audio.play();
						return;
					}

					if (Hls.isSupported()) {
						const hls = new Hls();
						hlsRef.current = hls;

						hls.loadSource(url);
						hls.attachMedia(audio);

						hls.on(Hls.Events.MANIFEST_PARSED, () => {
							if (isPlaying) {
								audio.play();
							}
						});
					} else {
						const notificationId = createNotification(
							`Failed to play track because browser doesn't support HLS`,
							{
								timeout: null,
							},
						);
						setFailedNotificationId(notificationId);
					}
				}
			})
			.catch((e) => {
				if (typeof e?.body?.message == "string") {
					const notificationId = createNotification(e.body.message, {
						timeout: null,
					});
					setFailedNotificationId(notificationId);
				} else {
					const notificationId = createNotification(
						`Something went wrong when attempting to play track`,
						{
							timeout: null,
						},
					);
					setFailedNotificationId(notificationId);
				}

				console.error(e);
			});

		return () => {
			cancelled = true;
		};
	}, [currentTrack]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.play().catch(() => {
				usePlayerStore.setState({ isPlaying: false });
			});
		} else {
			audio.pause();
		}
	}, [isPlaying, currentTrack]);

	useEffect(() => {
		const audio = audioRef.current;
		if (audio && seekTo !== null) {
			audio.currentTime = seekTo;
			usePlayerStore.setState({ seekTo: null });
		}
	}, [seekTo]);

	const handleTimeUpdate = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (audio) {
			if (isNaN(audio.duration)) {
				updateProgress(audio.currentTime, -1);
			} else {
				updateProgress(audio.currentTime, audio.duration);
			}
		}
	};

	return (
		<audio
			ref={audioRef}
			onEnded={() => {
				if (currentIndex < queue.length - 1) {
					next();
					setIsPlaying(true);
				}
			}}
			onPlay={() => usePlayerStore.setState({ isPlaying: true })}
			onPause={() => usePlayerStore.setState({ isPlaying: false })}
			onTimeUpdate={handleTimeUpdate}
			onLoadedMetadata={handleTimeUpdate}
			onWaiting={() => setIsBuffering(true)}
			onPlaying={() => setIsBuffering(false)}
			onCanPlay={() => setIsBuffering(false)}
			onStalled={() => setIsBuffering(true)}
			crossOrigin="anonymous"
		/>
	);
}
