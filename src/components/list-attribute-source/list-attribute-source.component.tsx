import { AttributeSource } from "@api/model";
import styles from "./list-attribute-source.module.scss";
import { useTranslation } from "@/context/language.context";

interface Props {
	source: AttributeSource;
}

export function ListAttributeSource({ source }: Props) {
	const { t } = useTranslation();

	return (
		<div className={styles.container}>
			<div className={styles.info}>
				<span className={styles.plugin}>
					{t(`plugin.${source.pluginId}.name`)}
				</span>
				<span className={styles.name}>{source.name}</span>
			</div>
		</div>
	);
}
