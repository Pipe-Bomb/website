import { PluginLibrary } from "@api/model";
import styles from "./list-library.module.scss";
import { useTranslation } from "@/context/language.context";

interface Props {
	library: PluginLibrary;
}

export function ListLibrary({ library }: Props) {
	const { t } = useTranslation();

	return (
		<div className={styles.container}>
			<span className={styles.source}>
				{t(`plugin.${library.pluginId}.name`)}
			</span>
			<span className={styles.name}>{library.name}</span>
		</div>
	);
}
