"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import type { WikiNode, WikiPage } from "@/lib/wiki";
import styles from "./wiki-sidebar.module.scss";

function slugToHref(slug: string[]): string {
	if (slug.length === 0) {
		return "/wiki";
	}
	return "/wiki/" + slug.join("/");
}


function WikiTreeNode({
	node,
	depth,
	activePath,
}: {
	node: WikiNode;
	depth: number;
	activePath: string;
}) {
	const [open, setOpen] = useState(node.kind === "section");

	const indent = { paddingLeft: `${10 + depth * 14}px` };

	if (node.kind === "page") {
		const href = slugToHref(node.slug);
		const isActive = activePath === href;
		return (
			<Link
				href={href}
				className={`${styles.pageLink}${isActive ? ` ${styles.active}` : ""}`}
				style={indent}
			>
				{node.title}
			</Link>
		);
	}

	return (
		<div className={styles.section}>
			<button
				className={styles.sectionToggle}
				onClick={() => setOpen((o) => !o)}
				style={indent}
			>
				<span className={styles.sectionLabel}>{node.title}</span>
				{open ? (
					<IconChevronDown size={13} stroke={1.5} className={styles.chevron} />
				) : (
					<IconChevronRight size={13} stroke={1.5} className={styles.chevron} />
				)}
			</button>
			{open && (
				<div>
					{node.children.map((child, i) => (
						<WikiTreeNode
							key={i}
							node={child}
							depth={depth + 1}
							activePath={activePath}
						/>
					))}
				</div>
			)}
		</div>
	);
}

const HOME_NODE: WikiPage = {
	kind: "page",
	title: "Home",
	slug: [],
	file: "Home.md",
};

export function WikiSidebar({ tree }: { tree: WikiNode[] }) {
	const pathname = usePathname();

	return (
		<nav className={styles.sidebar} aria-label="Wiki navigation">
			<WikiTreeNode node={HOME_NODE} depth={0} activePath={pathname} />
			{tree.map((node, i) => (
				<WikiTreeNode key={i} node={node} depth={0} activePath={pathname} />
			))}
		</nav>
	);
}
