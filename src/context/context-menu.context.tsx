"use client";

import { ContextMenu } from "@/components/context-menu/context-menu.component";
import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
	HTMLAttributeAnchorTarget,
} from "react";
import { createPortal } from "react-dom";

export type ContextMenuElement = {
	key: string;
} & (
	| {
			onClick: () => void;
	  }
	| {
			href: string;
			target?: HTMLAttributeAnchorTarget;
	  }
) &
	(
		| {
				languageKey: string;
		  }
		| {
				text: string;
		  }
	);

type MenuState = {
	x: number;
	y: number;
	elements: ContextMenuElement[];
	anchor: HTMLElement | null;
} | null;

const ContextMenuContext = createContext<{
	openMenu: (
		x: number,
		y: number,
		elements: ContextMenuElement[],
		anchor?: HTMLElement | null,
	) => void;
	closeMenu: () => void;
} | null>(null);

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [menu, setMenu] = useState<MenuState>(null);
	const menuRef = useRef<HTMLDivElement | null>(null);

	const closeMenu = () => setMenu(null);

	const openMenu = (
		x: number,
		y: number,
		elements: ContextMenuElement[],
		anchor: HTMLElement | null = null,
	) => {
		if (elements.length) {
			setMenu({ x, y, elements, anchor });
		}
	};

	// Close on outside click
	useEffect(() => {
		if (!menu) return;

		const handleClick = (e: MouseEvent) => {
			if (!menuRef.current) return;
			if (!menuRef.current.contains(e.target as Node)) {
				closeMenu();
			}
		};

		window.addEventListener("mousedown", handleClick);
		return () => window.removeEventListener("mousedown", handleClick);
	}, [menu]);

	// Close on resize / scroll
	useEffect(() => {
		if (!menu) return;

		const handleChange = () => closeMenu();

		window.addEventListener("resize", handleChange);
		window.addEventListener("scroll", handleChange, true);

		return () => {
			window.removeEventListener("resize", handleChange);
			window.removeEventListener("scroll", handleChange, true);
		};
	}, [menu]);

	// Close if anchor disappears
	useEffect(() => {
		if (!menu?.anchor) return;

		const interval = setInterval(() => {
			if (!menu.anchor || !document.body.contains(menu.anchor)) {
				closeMenu();
			}
		}, 250);

		return () => clearInterval(interval);
	}, [menu]);

	return (
		<ContextMenuContext.Provider value={{ openMenu, closeMenu }}>
			{children}

			{menu &&
				createPortal(
					<ContextMenu
						ref={menuRef}
						x={menu.x}
						y={menu.y}
						elements={menu.elements}
					/>,
					document.body,
				)}
		</ContextMenuContext.Provider>
	);
};

export const useContextMenu = () => {
	const ctx = useContext(ContextMenuContext);
	if (!ctx) throw new Error("Missing ContextMenuProvider");
	return ctx;
};
