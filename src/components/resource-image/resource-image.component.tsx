"use client";

import { Resource } from "@api/model";
import { useEffect, useMemo, useState } from "react";
import styles from "./resource-image.module.scss";
import { cc } from "@/lib/util";

interface Props {
	resource: Resource | null;
	className?: string;
	fallbackSrc?: string;
}

export function ResourceImage({ resource, className, fallbackSrc }: Props) {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		if (resource?.url) {
			setUrl(resource.url);
		} else {
			setUrl(fallbackSrc ?? null);
		}
	}, [resource?.url, fallbackSrc]);

	return (
		<div className={cc(styles.container, className)}>
			{!!url && (
				<img
					src={url}
					className={styles.image}
					onError={() => setUrl(fallbackSrc ?? null)}
				/>
			)}
		</div>
	);
}
