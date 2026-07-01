import { Contents } from "@/app/settings/user/[pluginId]/[configId]/contents";

interface Props {
	params: Promise<{
		pluginId: string;
		configId: string;
	}>;
}

export default async function Page({ params }: Props) {
	const { pluginId, configId } = await params;

	return <Contents pluginId={pluginId} configId={configId} />;
}
