"use client";

import { useAuth } from "@/context/auth.context";

export function usePrivilegeCheck() {
	const user = useAuth();

	return (key: string, pluginId: string | null = null) => {
		if (!user?.privileges) {
			return false;
		}

		for (const privilege of user.privileges) {
			if (privilege.pluginId == pluginId && privilege.key == key) {
				return privilege.granted || privilege.grantedByInclusion;
			}
		}
		return false;
	};
}
