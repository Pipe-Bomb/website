import { Contents } from "@/app/settings/plugin/[pluginId]/contents";

interface Props {
	params: Promise<{
		pluginId: string;
	}>;
}

export default async function Page({ params }: Props) {
	const { pluginId } = await params;

	return <Contents pluginId={pluginId} />;
}
