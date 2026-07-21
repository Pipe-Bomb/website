import { TextInput } from "@/components/text-input/text-input.component";
import styles from "./text.config-node.module.scss";
import { TextConfigNode as TextConfigNodeType } from "@api";
import { useEffect, useState } from "react";

interface Props {
	node: TextConfigNodeType;
	onChange: (id: string, value: any) => void;
	disabled?: boolean;
}

export function TextConfigNode({ node, onChange, disabled }: Props) {
	const [value, setValue] = useState(node.value);

	useEffect(() => {
		setValue(node.value);
	}, [node]);

	return (
		<div className={styles.container}>
			<span className={styles.name}>{node.name}</span>
			<div className={styles.inputContainer}>
				<TextInput
					placeholder={node.placeholder ?? undefined}
					value={value}
					onChange={(value) => {
						setValue(value);
						onChange(node.id, value);
					}}
					disabled={disabled}
				/>
			</div>
		</div>
	);
}
