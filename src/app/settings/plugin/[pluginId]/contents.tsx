"use client";

import { ConfigNode } from "@/components/config-node/config-node.component";
import { RootConfigNode } from "@/components/config-node/root.config-node.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { useTranslation } from "@/context/language.context";
import { useGetPluginConfig } from "@api";

interface Props {
	pluginId: string;
}

export function Contents({ pluginId }: Props) {
	const { t } = useTranslation();

	const configResponse = useGetPluginConfig(pluginId, {
		query: {
			enabled: true,
		},
	});

	return (
		<div>
			<h1>{t(`plugin.${pluginId}.name`)}</h1>
			{configResponse.data ? (
				configResponse.data.status == 200 ? (
					<RootConfigNode
						config={configResponse.data.data}
						pluginId={pluginId}
					/>
				) : (
					<h2>Config not found</h2>
				)
			) : (
				<Spinner />
			)}
		</div>
	);
}
