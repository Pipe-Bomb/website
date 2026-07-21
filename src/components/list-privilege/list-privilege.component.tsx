"use client";

import styles from "./list-privilege.module.scss";
import { useTranslation } from "@/context/language.context";
import { Checkbox } from "@/components/checkbox/checkbox.component";
import { Privilege } from "@api";

interface Props {
	privilege: Privilege;
	setGranted: (granted: boolean) => void;
	disabled?: boolean;
}

export function ListPrivilege({ privilege, setGranted, disabled }: Props) {
	const { t } = useTranslation();

	return (
		<div className={styles.container}>
			<Checkbox
				checked={privilege.granted || privilege.grantedByInclusion}
				onChange={setGranted}
				disabled={privilege.grantedByInclusion || disabled}
			/>
			<div className={styles.info}>
				<span className={styles.source}>
					{t(
						privilege.pluginId
							? `plugin.${privilege.pluginId}.name`
							: "privilege.system",
					)}
				</span>
				<button
					className={styles.name}
					onClick={() => setGranted(!privilege.granted)}
				>
					{t(
						`privilege.${privilege.pluginId ? `plugin.${privilege.pluginId}` : "system"}.${privilege.key}.name`,
					)}
				</button>
			</div>
		</div>
	);
}
