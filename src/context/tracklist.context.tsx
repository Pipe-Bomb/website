"use client";

import { EphemeralTrack, Track } from "@api";
import { createContext, ReactNode, useContext, useState } from "react";

const TrackListContext = createContext<{
	trackList: (Track | EphemeralTrack)[];
	setTrackList: (tracks: (Track | EphemeralTrack)[]) => void;
} | null>(null);

export function TrackListProvider({ children }: { children: ReactNode }) {
	const [trackList, setTrackList] = useState<(Track | EphemeralTrack)[]>([]);

	return (
		<TrackListContext.Provider value={{ trackList, setTrackList }}>
			{children}
		</TrackListContext.Provider>
	);
}

export function useTrackListContext() {
	const context = useContext(TrackListContext);
	if (!context) {
		throw new Error(
			"useTrackListContext must be used within TrackListProvider",
		);
	}
	return context;
}
