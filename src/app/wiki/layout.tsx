import { getWikiTree } from "@/lib/wiki";
import { WikiSidebar } from "@/components/wiki-sidebar.component";
import { WikiShell } from "@/components/wiki-shell.component";

export default function WikiLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const tree = getWikiTree();

	return (
		<WikiShell sidebar={<WikiSidebar tree={tree} />}>{children}</WikiShell>
	);
}
