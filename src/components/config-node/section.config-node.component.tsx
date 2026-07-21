import { SectionConfigNode as SectionConfigNodeType } from "@api";
import styles from "./section.config-node.module.scss";
import { ConfigNode } from "@/components/config-node/config-node.component";

interface Props {
	node: SectionConfigNodeType;
	onChange: (id: string, value: any) => void;
	disabled?: boolean;
}

export function SectionConfigNode({ node, onChange, disabled }: Props) {
	return (
		<div className={styles.container}>
			{node.children.map((child, index) => (
				<ConfigNode
					node={child}
					key={index}
					onChange={onChange}
					disabled={disabled}
				/>
			))}
		</div>
	);
}
