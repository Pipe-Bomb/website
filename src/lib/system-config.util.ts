import { SystemConfigOptions } from "@/api";

export type SystemConfigUnion = SystemConfigOptions["options"][0];

// type SystemConfigOptionByType<T extends SystemConfigUnion["type"]> = Extract<
// 	SystemConfigUnion,
// 	{ type: T }
// >;

// export type SinglePersistentAttribute<T extends SystemConfigUnion["type"]> = {
// 	type: T;
// 	value: SystemConfigOptionByType<T>["values"][number];
// };

// export function getSystemConfigValue<T extends SystemConfigUnion["type"]>(
// 	options: SystemConfigOptions,
// 	key: string,
// 	type: T,
//     multiple: true
// )
