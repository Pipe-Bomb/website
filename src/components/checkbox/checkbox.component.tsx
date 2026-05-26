import { cc } from "@/lib/util";
import styles from "./checkbox.module.scss";

interface Props {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
}

export function Checkbox({ checked, onChange }: Props) {
	return (
		<button
			className={cc(styles.checkbox, checked && styles.checked)}
			onClick={() => onChange?.(!checked)}
		></button>
	);
}
