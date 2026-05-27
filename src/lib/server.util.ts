import { cookies } from "next/headers";

export async function getAuthHeaders(): Promise<HeadersInit | null> {
	const cookiesStore = await cookies();
	const token = cookiesStore.get("auth_token")?.value;

	if (!token) {
		return {};
	}

	return {
		Authorization: `Bearer ${token}`,
	};
}
