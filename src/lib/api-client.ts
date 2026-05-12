const BASE_URL = "http://127.0.0.1:3000";

interface RequestConfig {
	method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
	headers?: Record<string, string>;
	body?: any;
	responseType?: string;
}

type ResponseSuccess = {
	data: any;
	status: number;
	headers: Headers;
};

export async function customFetch<T extends ResponseSuccess>(
	url: string,
	config: RequestConfig,
): Promise<T> {
	const { method, headers, body, responseType } = config;

	const fullUrl = new URL(BASE_URL + url);

	const res = await fetch(fullUrl.toString(), {
		method,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		body,
		// credentials: "include",
	});

	// Parse body safely
	let parsedBody: any;

	if (responseType === "blob") {
		parsedBody = await res.blob();
	} else if (responseType === "text") {
		parsedBody = await res.text();
	} else {
		try {
			parsedBody = await res.json();
		} catch {
			parsedBody = null;
		}
	}

	if (!res.ok) {
		throw {
			status: res.status,
			body: parsedBody,
			headers: res.headers,
		};
	}

	return {
		data: parsedBody,
		status: res.status,
		headers: res.headers,
	} as T;
}
