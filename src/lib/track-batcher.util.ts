import { Track, EphemeralTrack, getTracks, TrackIdDto } from "@/api";

export const serializeTrackKey = (id: TrackIdDto): string => {
	return `${id.pluginId}:${id.libraryId}:${id.trackId}`;
};

export const deserializeTrackKey = (key: string): TrackIdDto => {
	const [pluginId, libraryId, trackId] = key.split(":");
	return { pluginId, libraryId, trackId };
};

const MAX_BATCH_SIZE = 50;

let queue: string[] = [];
let resolvers: Array<{
	resolve: (value: Track | EphemeralTrack | null) => void;
	reject: (reason?: unknown) => void;
}> = [];
let batchTimeout: NodeJS.Timeout | null = null;

export const fetchTrackBatched = (
	trackKey: string,
): Promise<Track | EphemeralTrack | null> => {
	return new Promise((resolve, reject) => {
		queue.push(trackKey);
		resolvers.push({ resolve, reject });

		if (!batchTimeout) {
			batchTimeout = setTimeout(async () => {
				const currentQueue = [...queue];
				const currentResolvers = [...resolvers];

				queue = [];
				resolvers = [];
				batchTimeout = null;

				try {
					const uniqueKeys = Array.from(new Set(currentQueue));

					const chunks: string[][] = [];
					for (let i = 0; i < uniqueKeys.length; i += MAX_BATCH_SIZE) {
						chunks.push(uniqueKeys.slice(i, i + MAX_BATCH_SIZE));
					}

					const chunkPromises = chunks.map(async (chunkKeys) => {
						const queryPayload = chunkKeys.map(deserializeTrackKey);
						return await getTracks({ tracks: queryPayload });
					});

					const responses = await Promise.all(chunkPromises);

					const tracksMap: Record<string, Track | EphemeralTrack> = {};
					responses.flat().forEach((response) => {
						if (response.status == 200) {
							for (const track of response.data) {
								const key = serializeTrackKey(track);
								tracksMap[key] = track;
							}
						}
					});

					currentQueue.forEach((trackKey, index) => {
						currentResolvers[index].resolve(tracksMap[trackKey] ?? null);
					});
				} catch (error) {
					console.error("Failed to execute chunked track batch lookups", error);
					currentResolvers.forEach(({ reject }) => reject(error));
				}
			}, 0);
		}
	});
};
