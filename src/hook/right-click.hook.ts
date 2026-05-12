import {
	ContextMenuElement,
	useContextMenu,
} from "@/context/context-menu.context";
import React from "react";

export const useRightClick = (getContent: () => ContextMenuElement[]) => {
	const { openMenu } = useContextMenu();

	return {
		onContextMenu: (e: React.MouseEvent) => {
			e.preventDefault();

			openMenu(
				e.clientX,
				e.clientY,
				getContent(),
				e.currentTarget as HTMLElement,
			);
		},
	};
};
