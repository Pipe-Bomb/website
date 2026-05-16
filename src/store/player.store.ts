import { Track } from "@api/model";
import { create } from "zustand";

interface PlayerStore {
	queue: Track[];
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

	playTrack: (track: Track, indexInList?: number, entireList?: Track[]) => void;
	addToEnd: (tracks: Track[]) => void;
	playNext: (track: Track) => void;
	playNow: (track: Track) => void;
	remove: (index: number) => void;

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
	addToEnd: (tracks: Track[]) => {
		set((state) => ({
			queue: [...state.queue, ...tracks],
		}));
	},

	// 2. "Play Next" (Insert right after the current track)
	playNext: (track: Track) => {
		set((state) => {
			const newQueue = [...state.queue];
			// Insert at the position right after the current index
			newQueue.splice(state.currentIndex + 1, 0, track);
			return { queue: newQueue };
		});
	},

	// 3. Helper to start playing if the queue was empty
	playNow: (track: Track) => {
		set((state) => ({
			queue: [track],
			currentIndex: 0,
			isPlaying: true,
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
