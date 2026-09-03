import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

const WIKI_DIR = path.join(process.cwd(), "wiki-content");

export type WikiPage = {
	kind: "page";
	title: string;
	slug: string[];
	file: string;
};

export type WikiSection = {
	kind: "section";
	title: string;
	children: WikiNode[];
};

export type WikiNode = WikiPage | WikiSection;

function titleFromFilename(name: string): string {
	return name.replace(/\.md$/, "").replace(/-/g, " ");
}

function firstHeading(content: string): string | null {
	const match = content.match(/^#\s+(.+)$/m);
	if (!match) {
		return null;
	}
	return match[1].trim();
}

function walkDir(
	dir: string,
	slugPrefix: string[],
	filePrefix: string,
): WikiNode[] {
	if (!fs.existsSync(dir)) {
		throw new Error(
			`wiki-content not found at ${dir}. Run: npm run wiki:clone`,
		);
	}

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	const nodes: WikiNode[] = [];

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const newFilePrefix = filePrefix
				? `${filePrefix}/${entry.name}`
				: entry.name;
			const children = walkDir(
				path.join(dir, entry.name),
				[...slugPrefix, entry.name.toLowerCase()],
				newFilePrefix,
			);
			if (children.length > 0) {
				nodes.push({
					kind: "section",
					title: titleFromFilename(entry.name),
					children,
				});
			}
		} else if (
			entry.name.endsWith(".md") &&
			entry.name !== "Home.md" &&
			entry.name !== "_Sidebar.md"
		) {
			const baseName = entry.name.replace(/\.md$/, "");
			const file = filePrefix ? `${filePrefix}/${entry.name}` : entry.name;
			const content = fs.readFileSync(path.join(dir, entry.name), "utf-8");
			const title = firstHeading(content) ?? titleFromFilename(baseName);
			nodes.push({
				kind: "page",
				title,
				slug: [...slugPrefix, baseName.toLowerCase()],
				file,
			});
		}
	}

	return nodes;
}

// ---- _Sidebar.md parser ----

type MdastNode = {
	type: string;
	value?: string;
	children?: MdastNode[];
};

function extractText(node: MdastNode): string {
	if (node.value !== undefined) {
		return node.value;
	}
	if (node.children) {
		return node.children.map(extractText).join("");
	}
	return "";
}

function parseSidebarWikiLink(
	text: string,
): { display: string; slug: string[]; hasExplicitDisplay: boolean } | null {
	const match = text.trim().match(/^\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]$/);
	if (!match) {
		return null;
	}
	const first = match[1].trim();
	const second = match[2]?.trim();
	const hasExplicitDisplay = second !== undefined;
	const page = hasExplicitDisplay ? second! : first;
	const slug =
		page.toLowerCase() === "home"
			? []
			: page.split("/").map((s) => s.toLowerCase().replace(/\s+/g, "-"));
	return { display: first, slug, hasExplicitDisplay };
}

function buildFileIndex(): Map<string, WikiPage> {
	const index = new Map<string, WikiPage>();

	function flatten(nodes: WikiNode[]): void {
		for (const node of nodes) {
			if (node.kind === "page") {
				index.set(node.slug.join("/"), node);
			} else {
				flatten(node.children);
			}
		}
	}

	const homePath = path.join(WIKI_DIR, "Home.md");
	if (fs.existsSync(homePath)) {
		const content = fs.readFileSync(homePath, "utf-8");
		index.set("", {
			kind: "page",
			title: firstHeading(content) ?? "Home",
			slug: [],
			file: "Home.md",
		});
	}

	flatten(walkDir(WIKI_DIR, [], ""));
	return index;
}

function parseSidebarList(
	items: MdastNode[],
	fileIndex: Map<string, WikiPage>,
): WikiNode[] {
	const nodes: WikiNode[] = [];

	for (const item of items) {
		if (item.type !== "listItem" || !item.children) {
			continue;
		}
		const para = item.children.find((c) => c.type === "paragraph");
		const nestedList = item.children.find((c) => c.type === "list");

		if (!para) {
			continue;
		}

		const text = extractText(para).trim();

		if (nestedList && nestedList.children) {
			const children = parseSidebarList(nestedList.children, fileIndex);
			if (children.length > 0) {
				nodes.push({ kind: "section", title: text, children });
			}
		} else {
			const link = parseSidebarWikiLink(text);
			if (link) {
				const page = fileIndex.get(link.slug.join("/"));
				if (page) {
					const title = link.hasExplicitDisplay ? link.display : page.title;
					nodes.push({ ...page, title });
				}
			}
		}
	}

	return nodes;
}

function parseSidebar(sidebarPath: string): WikiNode[] {
	const content = fs.readFileSync(sidebarPath, "utf-8");
	const ast = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.parse(content) as unknown as MdastNode;
	const fileIndex = buildFileIndex();
	const nodes: WikiNode[] = [];
	let pendingLabel: string | null = null;

	for (const child of ast.children ?? []) {
		if (child.type === "heading") {
			pendingLabel = extractText(child).trim();
		} else if (
			child.type === "paragraph" &&
			child.children?.length === 1 &&
			child.children[0].type === "strong"
		) {
			pendingLabel = extractText(child).trim();
		} else if (child.type === "list" && child.children) {
			const items = parseSidebarList(child.children, fileIndex);
			if (pendingLabel !== null) {
				if (items.length > 0) {
					nodes.push({ kind: "section", title: pendingLabel, children: items });
				}
				pendingLabel = null;
			} else {
				nodes.push(...items);
			}
		} else {
			pendingLabel = null;
		}
	}

	return nodes;
}

export function getWikiTree(): WikiNode[] {
	const sidebarPath = path.join(WIKI_DIR, "_Sidebar.md");
	if (fs.existsSync(sidebarPath)) {
		return parseSidebar(sidebarPath);
	}
	return walkDir(WIKI_DIR, [], "");
}

export function getAllWikiSlugs(): { slug: string[] }[] {
	// Always walks the filesystem — generateStaticParams must include every
	// .md file regardless of what _Sidebar.md lists.
	const slugs: { slug: string[] }[] = [{ slug: [] }];

	function flatten(nodes: WikiNode[]): void {
		for (const node of nodes) {
			if (node.kind === "page") {
				slugs.push({ slug: node.slug });
			} else {
				flatten(node.children);
			}
		}
	}

	flatten(walkDir(WIKI_DIR, [], ""));
	return slugs;
}

function findPage(nodes: WikiNode[], slug: string[]): WikiPage | null {
	const target = slug.join("/");
	for (const node of nodes) {
		if (node.kind === "page") {
			if (node.slug.join("/") === target) {
				return node;
			}
		} else {
			const found = findPage(node.children, slug);
			if (found) {
				return found;
			}
		}
	}
	return null;
}

function resolveWikiLinks(content: string): string {
	// [[Page]] or [[Display Text|Page Name]] (Gollum format: display|page)
	return content.replace(
		/\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g,
		(_, first: string, second: string | undefined) => {
			const display = first.trim();
			const page = (second ?? first).trim();
			const slug =
				page.toLowerCase() === "home"
					? ""
					: page
							.split("/")
							.map((s) => s.toLowerCase().replace(/\s+/g, "-"))
							.join("/");
			const href = slug ? `/wiki/${slug}` : "/wiki";
			return `[${display}](${href})`;
		},
	);
}

async function processMarkdown(content: string): Promise<string> {
	const file = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeShiki, {
			theme: "github-dark",
			transformers: [
				{
					pre(node) {
						// Expose language for the CSS label; remove Shiki's inline
						// background so our CSS variable controls it instead.
						node.properties["data-language"] = this.options.lang;
						delete node.properties["style"];
					},
				},
			],
		})
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behavior: "wrap" })
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(resolveWikiLinks(content));

	// Open external links in a new tab.
	return String(file).replace(
		/<a href="(https?:\/\/[^"]+)"/g,
		'<a target="_blank" rel="noopener noreferrer" href="$1"',
	);
}

export async function getWikiPageBySlug(
	slug: string[],
): Promise<{ title: string; html: string } | null> {
	if (slug.length === 0) {
		const homePath = path.join(WIKI_DIR, "Home.md");
		if (!fs.existsSync(homePath)) {
			return null;
		}
		const content = fs.readFileSync(homePath, "utf-8");
		const title = firstHeading(content) ?? "Home";
		const html = await processMarkdown(content);
		return { title, html };
	}

	const tree = getWikiTree();
	const page = findPage(tree, slug);
	if (!page) {
		return null;
	}

	const filePath = path.join(WIKI_DIR, ...page.file.split("/"));
	if (!fs.existsSync(filePath)) {
		return null;
	}

	const content = fs.readFileSync(filePath, "utf-8");
	const html = await processMarkdown(content);
	return { title: page.title, html };
}
