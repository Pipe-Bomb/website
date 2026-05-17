import { Identifier, IdentifierDependency } from "@api";
import styles from "./list-identifier.module.scss";
import { useTranslation } from "@/context/language.context";

interface Props {
	identifier: Identifier;
}

export function ListIdentifier({ identifier }: Props) {
	const { t } = useTranslation();

	return (
		<div className={styles.container}>
			<div className={styles.info}>
				<span className={styles.plugin}>
					{t(`plugin.${identifier.pluginId}.name`)}
				</span>
				<span className={styles.name}>{identifier.identifierId}</span>
			</div>

			<div className={styles.dependenciesContainer}>
				<DependencyList deps={identifier.dependencies} title="Depends on" />
				<DependencyList
					deps={identifier.softDependencies}
					title="Soft-depends on"
				/>
			</div>
		</div>
	);
}

interface DependencyListProps {
	deps: IdentifierDependency[];
	title: string;
}

function DependencyList({ deps, title }: DependencyListProps) {
	if (!deps.length) {
		return null;
	}

	return (
		<div className={styles.dependencyCategory}>
			<span className={styles.dependencyCategoryTitle}>{title}</span>
			{deps.map((dependency, index) => (
				<div key={index} className={styles.dependency}>
					{dependency.pluginId && (
						<span className={styles.dependencyPlugin}>
							{dependency.pluginId}
						</span>
					)}
					<span>{dependency.sourceId}</span>
				</div>
			))}
		</div>
	);
}
