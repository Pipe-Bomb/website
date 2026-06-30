import {
	ContextMenuElement,
	useContextMenu,
} from "@/context/context-menu.context";
import { useTranslation } from "@/context/language.context";
import React, { forwardRef, useLayoutEffect, useState } from "react";
import styles from "./context-menu.module.scss";
import Link from "next/link";

interface Props {
	x: number;
	y: number;
	elements: ContextMenuElement[];
}

export const ContextMenu = forwardRef<HTMLDivElement, Props>(
	({ x, y, elements }, ref) => {
		const [pos, setPos] = useState({ x, y });
		const { closeMenu } = useContextMenu();

		useLayoutEffect(() => {
			const el = (ref as React.RefObject<HTMLDivElement>).current;
			if (!el) return;

			const rect = el.getBoundingClientRect();

			let newX = x;
			let newY = y;

			if (x + rect.width > window.innerWidth) {
				newX = window.innerWidth - rect.width - 4;
			}

			if (y + rect.height > window.innerHeight) {
				newY = window.innerHeight - rect.height - 4;
			}

			setPos({ x: newX, y: newY });
		}, [x, y, ref]);

		return (
			<div
				ref={ref}
				style={{
					position: "fixed",
					top: pos.y,
					left: pos.x,
				}}
				className={styles.container}
			>
				{elements.map((element) =>
					"onClick" in element ? (
						<button
							key={element.key}
							className={styles.element}
							onClick={() => {
								closeMenu();
								element.onClick();
							}}
						>
							<ElementContent element={element} />
						</button>
					) : (
						<Link
							key={element.key}
							href={element.href}
							target={element.target}
							className={styles.element}
							onClick={closeMenu}
						>
							<ElementContent element={element} />
						</Link>
					),
				)}
			</div>
		);
	},
);

function ElementContent({ element }: { element: ContextMenuElement }) {
	const { t } = useTranslation();

	return <div>{t(element.languageKey)}</div>;
}
