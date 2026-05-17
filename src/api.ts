import { setBaseUrl } from "pipe-bomb-tanstack-client";

if (typeof window === "undefined") {
	const serverUrl = process.env.INTERNAL_API_URL || "http://127.0.0.1:3000";
	setBaseUrl(serverUrl);
} else {
	const clientUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000";
	setBaseUrl(clientUrl);
}

export * from "pipe-bomb-tanstack-client";
