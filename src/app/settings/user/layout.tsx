"use client";

import { ReactNode, useMemo } from "react";
import styles from "../layout.module.scss";
import Link from "next/link";
import {
	useGetAllPluginConfigs,
	useGetAllUserConfigs,
	UserConfigStub,
} from "@api";
import { useTranslation } from "@/context/language.context";
import { Spinner } from "@/components/spinner/spinner.component";

interface Props {
	children: ReactNode;
}

export default function Layout({ children }: Props) {
	const pluginConfigsResponse = useGetAllUserConfigs({
		query: {
			enabled: true,
			refetchInterval: 3000,
		},
	});

	const pluginConfigSections = useMemo(() => {
		if (!pluginConfigsResponse.data?.data) {
			return {};
		}

		const map: Record<string, UserConfigStub[]> = {};

		for (const config of pluginConfigsResponse.data.data.configs) {
			if (config.pluginId in map) {
				map[config.pluginId].push(config);
			} else {
				map[config.pluginId] = [config];
			}
		}

		return map;
	}, [pluginConfigsResponse.data?.data]);

	const { t } = useTranslation();

	const pluginConfigs = pluginConfigsResponse.data?.data;

	return (
		<div className={styles.container}>
			<div className={styles.sideBar}>
				{Object.entries(pluginConfigSections).map(([pluginId, configs]) => (
					<div key={pluginId}>
						<h3>{t(`plugin.${pluginId}.name`)}</h3>
						<div className={styles.tabs}>
							{configs.map((config) => (
								<Link
									href={`/settings/user/${config.pluginId}/${config.configId}`}
									key={config.configId}
								>
									{t(
										`plugin.${config.pluginId}.user-config.${config.configId}.name`,
									)}
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
			<div className={styles.content}>{children}</div>
		</div>
	);
}
