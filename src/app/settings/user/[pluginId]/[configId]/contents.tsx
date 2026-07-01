"use client";

import { RootConfigNode } from "@/components/config-node/root.config-node.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { useTranslation } from "@/context/language.context";
import {
	getGetUserConfigQueryKey,
	PluginConfigUpdateDtoValues,
	updateUserConfig,
	useGetPluginConfig,
	useGetUserConfig,
} from "@api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
	pluginId: string;
	configId: string;
}

export function Contents({ pluginId, configId }: Props) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [isSaving, setIsSaving] = useState(false);

	const configResponse = useGetUserConfig(pluginId, configId, {
		query: {
			enabled: true,
		},
	});

	const save = (values: PluginConfigUpdateDtoValues) => {
		if (isSaving) {
			return;
		}
		setIsSaving(true);
		updateUserConfig(pluginId, configId, { values })
			.then((response) => {
				if (!response.data) {
					return;
				}
				queryClient.setQueryData(
					getGetUserConfigQueryKey(pluginId, configId),
					response,
				);
			})
			.catch(console.error)
			.finally(() => setIsSaving(false));
	};

	return (
		<div>
			<h1>{t(`plugin.${pluginId}.name`)}</h1>
			{configResponse.data ? (
				configResponse.data.status == 200 ? (
					<RootConfigNode config={configResponse.data.data} onSave={save} />
				) : (
					<h2>Config not found</h2>
				)
			) : (
				<Spinner />
			)}
		</div>
	);
}
