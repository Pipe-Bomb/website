import { ParagraphConfigNode as ParagraphConfigNodeType } from "@api";
import styles from "./paragraph.config-node.module.scss";
import { cc } from "@/lib/util";

interface Props {
	node: ParagraphConfigNodeType;
}

export function ParagraphConfigNode({ node }: Props) {
	return <p className={cc(styles.paragraph)}>{node.content}</p>;
}
