import { HeadingConfigNode as HeadingConfigNodeType } from "@api/model";
import styles from "./heading.config-node.module.scss";
import { cc } from "@/lib/util";

interface Props {
	node: HeadingConfigNodeType;
}

export function HeadingConfigNode({ node }: Props) {
	return (
		<h3 className={cc(styles.heading, styles[node.size])}>{node.content}</h3>
	);
}
