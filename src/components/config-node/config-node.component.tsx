import { PluginConfig } from "@api";
import { SectionConfigNode } from "@/components/config-node/section.config-node.component";
import { HeadingConfigNode } from "@/components/config-node/heading.config-node.component";
import { TextConfigNode } from "@/components/config-node/text.config-node.component";
import { ParagraphConfigNode } from "@/components/config-node/paragraph.config-node.component";

interface Props {
	node: PluginConfig["node"];
	onChange: (id: string, value: any) => void;
	disabled?: boolean;
}

export function ConfigNode({ node, onChange, disabled }: Props) {
	switch (node.type) {
		case "section":
			return (
				<SectionConfigNode
					node={node}
					onChange={onChange}
					disabled={disabled}
				/>
			);
		case "heading":
			return <HeadingConfigNode node={node} />;
		case "text":
			return (
				<TextConfigNode node={node} onChange={onChange} disabled={disabled} />
			);
		case "paragraph":
			return <ParagraphConfigNode node={node} />;
	}
}
