import {
	ContextMenuElement,
	useContextMenu,
} from "@/context/context-menu.context";

export const useButtonMenu = (getContent: () => ContextMenuElement[]) => {
	const { openMenu } = useContextMenu();

	return {
		onClick: (e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();

			const rect = e.currentTarget.getBoundingClientRect();

			const x = rect.left;
			const y = rect.bottom;

			openMenu(x, y, getContent(), e.currentTarget as HTMLElement);
		},
	};
};
