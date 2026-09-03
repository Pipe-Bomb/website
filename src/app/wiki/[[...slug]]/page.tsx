import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllWikiSlugs, getWikiPageBySlug } from "@/lib/wiki";
import styles from "./wiki-content.module.scss";

export const dynamicParams = false;

export async function generateStaticParams() {
	return getAllWikiSlugs();
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
	const params = await props.params;
	const page = await getWikiPageBySlug(params.slug ?? []);
	const title = page ? `${page.title} - Pipe Bomb Wiki` : "Wiki - Pipe Bomb";
	return { title };
}

export default async function WikiPage(props: {
	params: Promise<{ slug?: string[] }>;
}) {
	const params = await props.params;
	const page = await getWikiPageBySlug(params.slug ?? []);

	if (!page) {
		notFound();
	}

	return (
		<article
			className={styles.article}
			dangerouslySetInnerHTML={{ __html: page.html }}
		/>
	);
}
