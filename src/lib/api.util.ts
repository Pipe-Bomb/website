import {
	getArtistByIdentity,
	getArtist,
	getArtistResponse,
	getAlbumResponse,
	getAlbumByIdentity,
	getAlbum,
} from "@api";

export async function getArtistById(
	id: string,
	options?: RequestInit,
): Promise<getArtistResponse> {
	if (id.includes("~")) {
		const parts = id.split("~");
		if (parts.length == 3) {
			const [pluginId, identityId, identity] = parts;
			return getArtistByIdentity(pluginId, identityId, identity, options);
		}
	} else {
		return getArtist(id, options);
	}
	throw new Error("Invalid Artist ID");
}

export async function getAlbumById(
	id: string,
	options?: RequestInit,
): Promise<getAlbumResponse> {
	if (id.includes("~")) {
		const parts = id.split("~");
		if (parts.length == 3) {
			const [pluginId, identityId, identity] = parts;
			return getAlbumByIdentity(pluginId, identityId, identity, options);
		}
	} else {
		return getAlbum(id, options);
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
		const data = error?.body ?? error?.response?.body;

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

type Status5xx =
	| 500
	| 501
	| 502
	| 503
	| 504
	| 505
	| 506
	| 507
	| 508
	| 510
	| 511;

export class ApiServerError extends Error {
	constructor(
		public status: number,
		public data: any,
	) {
		super(
			typeof data === "object" && data?.message
				? data.message
				: `API Server Error (${status})`,
		);
		this.name = "ApiServerError";
	}
}

export function ensureNot5xx<R extends { status: number; data: any }>(
	response: R,
): Extract<R, { status: Exclude<R["status"], Status5xx> }> {
	if (response.status >= 500) {
		throw new ApiServerError(response.status, response.data);
	}
	return response as any;
}

export function unwrapData<R extends { status: number; data: any }>(
	response: R,
): Extract<R, { status: Exclude<R["status"], Status5xx> }>["data"] {
	if (response.status >= 500) {
		throw new ApiServerError(response.status, response.data);
	}
	return response.data;
}
