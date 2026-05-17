import styles from "./text.config-node.module.scss";
import { TextConfigNode as TextConfigNodeType } from "@api/model";
import { useEffect, useState } from "react";

interface Props {
	node: TextConfigNodeType;
	onChange: (id: string, value: any) => void;
}

export function TextConfigNode({ node, onChange }: Props) {
	const [value, setValue] = useState(node.value);

	useEffect(() => {
		setValue(node.value);
	}, [node]);

	return (
		<div className={styles.container}>
			<span className={styles.name}>{node.name}</span>
			<div className={styles.inputContainer}>
				<input
					type="text"
					className={styles.input}
					placeholder={node.placeholder ?? undefined}
					value={value}
					onChange={(e) => {
						setValue(e.currentTarget.value);
						onChange(node.id, e.currentTarget.value);
					}}
				/>
			</div>
		</div>
	);
}
