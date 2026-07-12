import { getAuthHeaders } from "@/lib/server.util";
import {
	getArtistByIdentity,
	getArtist,
	getArtistResponse,
	getAlbumResponse,
	getAlbumByIdentity,
	getAlbum,
} from "@api";

export async function getArtistById(id: string): Promise<getArtistResponse> {
	if (id.includes("~")) {
		const parts = id.split("~");
		if (parts.length == 3) {
			const [pluginId, identityId, identity] = parts;
			return getArtistByIdentity(pluginId, identityId, identity, {
				headers: (await getAuthHeaders()) ?? {},
			});
		}
	} else {
		return getArtist(id, {
			headers: (await getAuthHeaders()) ?? {},
		});
	}
	throw new Error("Invalid Artist ID");
}

export async function getAlbumById(id: string): Promise<getAlbumResponse> {
	if (id.includes("~")) {
		const parts = id.split("~");
		if (parts.length == 3) {
			const [pluginId, identityId, identity] = parts;
			return getAlbumByIdentity(pluginId, identityId, identity, {
				headers: (await getAuthHeaders()) ?? {},
			});
		}
	} else {
		return getAlbum(id, {
			headers: (await getAuthHeaders()) ?? {},
		});
	}
	throw new Error("Invalid Album ID");
}

type GeneratedResponse = { status: number; data: any };

export async function safeFetch<
	Args extends any[],
	R extends GeneratedResponse,
>(
	fetchFn: (...args: Args) => Promise<R>,
	...args: Args
): Promise<
	| (R extends any
			? [status: R["status"], data: R["data"], response: R, error: null]
			: never)
	| [status: null, data: null, response: null, error: Error]
> {
	try {
		const response = await fetchFn(...args);
		return [response.status, response.data, response, null] as any;
	} catch (error: any) {
		// Extract status and data if customFetch threw them inside an error object
		const status = error?.status ?? error?.response?.status;
		const data = error?.data ?? error?.response?.data;

		if (typeof status === "number") {
			const fullResponse = error?.response ?? error;
			return [status, data, fullResponse, null] as any;
		}

		// Fallback for unexpected system/network crashes
		return [
			null,
			null,
			null,
			error instanceof Error ? error : new Error(String(error)),
		] as any;
	}
}
