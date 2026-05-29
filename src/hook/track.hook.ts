import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Track, EphemeralTrack } from "@/api";
import { fetchTrackBatched } from "@/lib/track-batcher.util";

type SupportedTrack = Track | EphemeralTrack;

export function useTrack(
	trackKey: string | null | undefined,
): UseQueryResult<SupportedTrack | null, Error> {
	return useQuery({
		queryKey: ["track", trackKey],

		queryFn: async () => {
			if (!trackKey) return null;
			return await fetchTrackBatched(trackKey);
		},

		enabled: !!trackKey,

		staleTime: 10 * 60 * 1000, // Keep track metadata hot for 10 minutes
		gcTime: 30 * 60 * 1000, // Keep unused records in garbage collection for 30 minutes
		refetchOnWindowFocus: false,
	});
}
