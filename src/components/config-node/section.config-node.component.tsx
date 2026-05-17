import { SectionConfigNode as SectionConfigNodeType } from "@api/model";
import styles from "./section.config-node.module.scss";
import { ConfigNode } from "@/components/config-node/config-node.component";

interface Props {
	node: SectionConfigNodeType;
	onChange: (id: string, value: any) => void;
}

export function SectionConfigNode({ node, onChange }: Props) {
	return (
		<div className={styles.container}>
			{node.children.map((child, index) => (
				<ConfigNode node={child} key={index} onChange={onChange} />
			))}
		</div>
	);
}
