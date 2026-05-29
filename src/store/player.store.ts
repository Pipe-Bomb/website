import { EphemeralTrack, Track, TrackIdDto } from "@api";
import { create } from "zustand";

// type SupportedTrack = Track | EphemeralTrack | TrackIdDto;

interface PlayerStore {
	queue: string[];
	currentIndex: number;
	isPlaying: boolean;

	currentTime: number;
	duration: number;
	seekTo: number | null; // Used to signal the engine to jump

	isBuffering: boolean;
	setIsBuffering: (isBuffering: boolean) => void;

	// Actions
	updateProgress: (time: number, duration: number) => void;
	seek: (time: number) => void;

	playTrack: (
		trackId: string,
		indexInList?: number,
		entireList?: string[],
	) => void;
	addToEnd: (tracks: string[]) => void;
	playNext: (track: string) => void;
	playNow: (track: string) => void;
	remove: (index: number) => void;
	insert: (tracks: string[], index: number) => void;

	next: () => void;
	prev: () => void;
	toggle: () => void;
	setIsPlaying: (playing: boolean) => void;
	playIndex: (index: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	queue: [],
	currentIndex: 0,
	isPlaying: false,

	currentTime: 0,
	duration: 0,
	seekTo: null,

	isBuffering: false,
	setIsBuffering: (isBuffering) => set({ isBuffering }),

	updateProgress: (currentTime, duration) => set({ currentTime, duration }),
	seek: (time) => set({ seekTo: time }),

	playTrack: (track, indexInList, entireList) => {
		if (entireList) {
			set({
				queue: entireList,
				currentIndex: indexInList ?? 0,
				isPlaying: true,
			});
		} else {
			set((state) => ({
				queue: [...state.queue, track],
				currentIndex: state.queue.length,
				isPlaying: true,
			}));
		}
	},

	// 1. Standard "Add to Queue" (At the very end)
	addToEnd: (tracks: string[]) => {
		set((state) => ({
			queue: [...state.queue, ...tracks],
		}));
	},

	// 2. "Play Next" (Insert right after the current track)
	playNext: (track: string) => {
		set((state) => {
			const newQueue = [...state.queue];
			// Insert at the position right after the current index
			newQueue.splice(state.currentIndex + 1, 0, track);
			return { queue: newQueue };
		});
	},

	// 3. Helper to start playing if the queue was empty
	playNow: (track: string) => {
		set((state) => ({
			queue: [track],
			currentIndex: 0,
			isPlaying: true,
		}));
	},

	insert: (tracks, index) => {
		set((state) => ({
			queue: [
				...state.queue.slice(0, index + 1),
				...tracks,
				...state.queue.slice(index + 1),
			],
		}));
	},

	remove: (index: number) => {
		set((state) => ({
			queue: state.queue.filter((_track, i) => i != index),
		}));
	},

	next: () => {
		const { currentIndex, queue } = get();
		if (currentIndex < queue.length - 1) {
			set({ currentIndex: currentIndex + 1 });
		}
	},

	prev: () => {
		const { currentIndex } = get();
		if (currentIndex > 0) {
			set({ currentIndex: currentIndex - 1 });
		}
	},

	playIndex: (index) => set({ currentIndex: index }),

	setIsPlaying: (isPlaying) => set({ isPlaying }),

	toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
