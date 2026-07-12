import { cookies, headers } from "next/headers";

export async function getAuthHeaders(): Promise<HeadersInit | null> {
	const cookiesStore = await cookies();
	const token = cookiesStore.get("auth_token")?.value;

	const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
	const baseHeaders: HeadersInit = {};
	if (publicApiUrl) {
		try {
			const url = new URL(publicApiUrl);
			baseHeaders["X-Forwarded-Host"] = url.host;
			baseHeaders["X-Forwarded-Proto"] = url.protocol.replace(":", "");
		} catch {}
	}

	if (!token) {
		return baseHeaders;
	}

	return {
		...baseHeaders,
		Authorization: `Bearer ${token}`,
	};
}

export async function isSSR() {
	const allHeaders = await headers();
	return !!allHeaders.get("accept")?.includes("text/html");
}
