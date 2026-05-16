interface Props {
	params: Promise<{
		pluginId: string;
	}>;
}

export default async function Page({ params }: Props) {
	const { pluginId } = await params;

	return <h1>{pluginId}</h1>;
}
