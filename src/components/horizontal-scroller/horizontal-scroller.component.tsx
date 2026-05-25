"use client";

import { ReactNode, useMemo, useState } from "react";
import styles from "./horizontal-scroller.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useResizeDetector } from "react-resize-detector";
import { useIsMounted } from "@/hook/mounted.hook";

interface Props {
	children: ReactNode;
	heading: string;
}

export function HorizontalScroller({ children, heading }: Props) {
	const { ref, width } = useResizeDetector();
	const { ref: innerRef, width: innerWidth } = useResizeDetector();
	const [scrollAmount, setScrollAmount] = useState(0);
	const isMounted = useIsMounted();

	const [canScrollLeft, canScrollRight] = useMemo<[boolean, boolean]>(() => {
		if (!innerWidth || !width || innerWidth <= width) {
			return [false, false];
		}

		return [scrollAmount > 0, scrollAmount < innerWidth - width];
	}, [width, innerWidth, scrollAmount, isMounted]);

	const scroll = (amount: number) => {
		const div = ref.current;
		if (!div || !width) {
			return;
		}

		div.scrollBy({
			left: amount * width,
			behavior: "smooth",
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.top}>
				<h3 className={styles.heading}>{heading}</h3>
				{isMounted && (
					<>
						<IconButton
							icon={IconChevronLeft}
							iconSource="tabler"
							onClick={() => scroll(-1)}
							disabled={!canScrollLeft}
						/>
						<IconButton
							icon={IconChevronRight}
							iconSource="tabler"
							onClick={() => scroll(1)}
							disabled={!canScrollRight}
						/>
					</>
				)}
			</div>
			<div
				className={styles.content}
				ref={ref}
				onScroll={(e) => setScrollAmount(e.currentTarget.scrollLeft)}
			>
				<div className={styles.scroll} ref={innerRef}>
					{children}
				</div>
			</div>
		</div>
	);
}
