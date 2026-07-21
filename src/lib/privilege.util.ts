import { Privilege } from "@/api";

export function processPrivileges(privileges: Privilege[]): Privilege[] {
	const getCompositeId = (pluginId: string | null, key: string) =>
		`${pluginId ?? ""}:${key}`;

	const childMap = new Map<string, string[]>();

	for (const p of privileges) {
		const childId = getCompositeId(p.pluginId, p.key);

		for (const parentKey of p.includedIn) {
			const parentId = getCompositeId(p.pluginId, parentKey);

			if (!childMap.has(parentId)) {
				childMap.set(parentId, []);
			}
			childMap.get(parentId)!.push(childId);
		}
	}

	const queue: string[] = privileges
		.filter((p) => p.granted)
		.map((p) => getCompositeId(p.pluginId, p.key));

	const grantedByInclusionSet = new Set<string>();

	while (queue.length > 0) {
		const currentId = queue.shift()!;
		const children = childMap.get(currentId) || [];

		for (const childId of children) {
			if (!grantedByInclusionSet.has(childId)) {
				grantedByInclusionSet.add(childId);
				queue.push(childId);
			}
		}
	}

	return privileges.map((p) => ({
		...p,
		grantedByInclusion: grantedByInclusionSet.has(
			getCompositeId(p.pluginId, p.key),
		),
	}));
}
