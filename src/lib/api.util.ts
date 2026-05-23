import {
	getArtistByIdentity,
	getArtist,
	getArtistResponse,
	getAlbumResponse,
	getAlbumByIdentity,
	getAlbum,
} from "pipe-bomb-tanstack-client";

export function getArtistById(id: string): Promise<getArtistResponse> {
	if (id.includes("~")) {
		const parts = id.split("~");
		if (parts.length == 3) {
			const [pluginId, identityId, identity] = parts;
			return getArtistByIdentity(pluginId, identityId, identity);
		}
	} else {
		return getArtist(id);
	}
	throw new Error("Invalid Artist ID");
}

export function getAlbumById(id: string): Promise<getAlbumResponse> {
	if (id.includes("~")) {
		const parts = id.split("~");
		if (parts.length == 3) {
			const [pluginId, identityId, identity] = parts;
			return getAlbumByIdentity(pluginId, identityId, identity);
		}
	} else {
		return getAlbum(id);
	}
	throw new Error("Invalid Album ID");
}
