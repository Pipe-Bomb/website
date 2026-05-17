import { ExternalUrl } from "@api/model";
import styles from "./external-url-list.module.scss";
import Link from "next/link";

interface Props {
	urls: ExternalUrl[];
}

export function ExternalUrlList({ urls }: Props) {
	return (
		<div>
			<h3>External Urls</h3>
			<div className={styles.list}>
				{urls.map((url, index) => (
					<div key={index} className={styles.url}>
						<img className={styles.urlImage} src={url.iconUrl} />
						<Link href={url.url} target="_blank" className={styles.urlLink}>
							{url.name}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}
