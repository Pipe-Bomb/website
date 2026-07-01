"use client";

import { ReactNode } from "react";
import styles from "../layout.module.scss";
import Link from "next/link";
import { useGetAllPluginConfigs } from "@api";
import { useTranslation } from "@/context/language.context";
import { Spinner } from "@/components/spinner/spinner.component";

interface Props {
	children: ReactNode;
}

export default function Layout({ children }: Props) {
	const pluginConfigsResponse = useGetAllPluginConfigs({
		query: {
			enabled: true,
			refetchInterval: 3000,
		},
	});

	const { t } = useTranslation();

	const pluginConfigs = pluginConfigsResponse.data?.data;

	return (
		<div className={styles.container}>
			<div className={styles.sideBar}>
				<div className={styles.tabs}>
					<Link href="/settings/system/libraries">Libraries</Link>
					<Link href="/settings/system/attribute-sources">
						Attribute Sources
					</Link>
					<Link href="/settings/system/identifiers">Identifiers</Link>
					<Link href="/settings/system/tasks">Tasks</Link>
				</div>
				<h3>Plugin Configuration</h3>
				<div className={styles.tabs}>
					{pluginConfigs ? (
						pluginConfigs.configs.map((config) => (
							<Link
								href={`/settings/system/plugin/${config.id}`}
								key={config.id}
							>
								{t(`plugin.${config.id}.name`)}
							</Link>
						))
					) : (
						<Spinner />
					)}
				</div>
			</div>
			<div className={styles.content}>{children}</div>
		</div>
	);
}
