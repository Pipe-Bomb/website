"use client";

import { usePlayerStore } from "@/store/player.store";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { createTrackAudioSession } from "@api";

export default function AudioEngine() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const hlsRef = useRef<Hls | null>(null);

	const {
		queue,
		currentIndex,
		isPlaying,
		next,
		seekTo,
		updateProgress,
		setIsPlaying,

		setIsBuffering,
	} = usePlayerStore();

	const currentTrack = queue[currentIndex];

	// Load track (stream or HLS)
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentTrack) return;

		let cancelled = false;

		// cleanup previous playback engine
		if (hlsRef.current) {
			hlsRef.current.destroy();
			hlsRef.current = null;
		}

		audio.src = ""; // reset

		setIsBuffering(true);

		createTrackAudioSession(
			currentTrack.pluginId,
			currentTrack.libraryId,
			currentTrack.id,
		)
			.then(({ data: session }) => {
				if (cancelled || !audio) return;

				if (session.type === "stream") {
					audio.src = `${session.baseUrl}/stream`;
					audio.load();
					audio.play();
				}

				if (session.type === "hls") {
					const url = `${session.baseUrl}/hls/playlist.m3u8`;

					// Safari has native HLS support
					if (audio.canPlayType("application/vnd.apple.mpegurl")) {
						audio.src = url;
						audio.load();
						audio.play();
						return;
					}

					// hls.js path
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
						console.error("HLS not supported in this browser");
					}
				}
			})
			.catch(console.error);

		return () => {
			cancelled = true;
		};
	}, [currentTrack]);

	// Play/pause sync
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

	// Seek handling
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
				next();
				setIsPlaying(true);
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
