import { ConfigNode } from "@/components/config-node/config-node.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { getGetPluginConfigQueryKey, updatePluginConfig } from "@api";
import { PluginConfig } from "@api";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

interface Props {
	config: PluginConfig;
	pluginId: string;
}

export function RootConfigNode({ config, pluginId }: Props) {
	const defaultValues = useMemo(() => {
		const values: Record<string, any> = {};
		const evaluate = (node: PluginConfig["node"]) => {
			if (node.type == "section") {
				for (const child of node.children) {
					evaluate(child);
				}
			}
			if (node.type == "text") {
				values[node.id] = node.value;
			}
		};
		evaluate(config.node);
		return values;
	}, [config]);

	const [isSaving, setIsSaving] = useState(false);
	const [values, setValues] = useState<Record<string, any>>({});
	const queryClient = useQueryClient();
	const hasChanges = useMemo(() => {
		for (const [key, value] of Object.entries(defaultValues)) {
			if (key in values) {
				if (value !== values[key]) {
					return true;
				}
			}
		}
		return false;
	}, [defaultValues, values]);

	useEffect(() => {
		setValues(defaultValues);
	}, [defaultValues]);

	const save = () => {
		console.log(values);
		if (isSaving) {
			return;
		}
		setIsSaving(true);
		updatePluginConfig(pluginId, { values })
			.then((response) => {
				if (!response.data) {
					return;
				}
				const config = response.data;
				console.log(config);
				queryClient.setQueryData(
					getGetPluginConfigQueryKey(pluginId),
					response,
				);
			})
			.catch(console.error)
			.finally(() => setIsSaving(false));
	};

	return (
		<div>
			<ConfigNode
				node={config.node}
				onChange={(id, value) =>
					setValues((values) => ({ ...values, [id]: value }))
				}
			/>
			<div>
				<IconButton
					icon={IconDeviceFloppy}
					iconSource="tabler"
					style={hasChanges ? "background" : "simple"}
					onClick={save}
				/>
			</div>
		</div>
	);
}
