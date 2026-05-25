"use client";

import { ListTrack } from "@/components/list-track/list-track.component";
import { EphemeralTrack, Track } from "@api";
import styles from "./track-list.module.scss";
import { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import { Virtuoso } from "react-virtuoso";
import {
	AttributeColumn,
	useTrackColumns,
} from "@/context/track-columns.context";
import { useScrollParentContext } from "@/context/scroll-parent.context";

interface Props {
	tracks: (Track | EphemeralTrack)[];
	trackNumbers?: number[];
	noArt?: boolean;
}

const MAIN_MIN_WIDTH = 200;
const COLUMN_MIN_WIDTH = 50;

export function TrackList({ tracks, trackNumbers, noArt }: Props) {
	const { columns, setColumns } = useTrackColumns();
	const { ref, width } = useResizeDetector();
	const { scrollParent } = useScrollParentContext();

	const boundColumns = useMemo<AttributeColumn[]>(() => {
		if (!width) {
			return [];
		}

		const totalMinColumnsWidth = columns.length * COLUMN_MIN_WIDTH;
		const maxAvailableColumnSpace = width - MAIN_MIN_WIDTH;

		if (maxAvailableColumnSpace < totalMinColumnsWidth) {
			return columns.map((col) => ({ ...col, width: COLUMN_MIN_WIDTH }));
		}

		const totalRequestedWidth = columns.reduce(
			(sum, col) => sum + col.width,
			0,
		);

		if (totalRequestedWidth <= maxAvailableColumnSpace) {
			return columns;
		}

		const flexibleSpaceAvailable =
			maxAvailableColumnSpace - totalMinColumnsWidth;
		const totalFlexibleSpaceRequested =
			totalRequestedWidth - totalMinColumnsWidth;

		if (totalFlexibleSpaceRequested <= 0) {
			return columns.map((col) => ({ ...col, width: COLUMN_MIN_WIDTH }));
		}

		return columns.map((column) => {
			const columnFlexibleRequested = column.width - COLUMN_MIN_WIDTH;
			const scaledFlexibleSpace =
				columnFlexibleRequested *
				(flexibleSpaceAvailable / totalFlexibleSpaceRequested);

			return {
				...column,
				width: COLUMN_MIN_WIDTH + scaledFlexibleSpace,
			};
		});
	}, [columns, width]);

	const startDrag = (e: MouseEvent, index: number) => {
		const mover = e.currentTarget as HTMLSpanElement | null;
		if (!mover || !width) {
			return;
		}

		const startX = e.clientX;

		const currentVisibleWidths = boundColumns.map((c) => c.width);
		const initialWidth = currentVisibleWidths[index];

		const maxAvailableColumnSpace = width - MAIN_MIN_WIDTH;

		const otherColumnsWidth = currentVisibleWidths.reduce(
			(sum, w, idx) => sum + (idx === index ? 0 : w),
			0,
		);

		const maxPossibleWidth = maxAvailableColumnSpace - otherColumnsWidth;

		const moveListener = (e: MouseEvent) => {
			const offset = e.clientX - startX;

			let newWidth = initialWidth - offset;

			newWidth = Math.max(
				COLUMN_MIN_WIDTH,
				Math.min(newWidth, maxPossibleWidth),
			);

			setColumns((prevColumns) =>
				prevColumns.map((column, columnIndex) => {
					if (columnIndex === index) {
						return { ...column, width: newWidth };
					}
					return { ...column, width: currentVisibleWidths[columnIndex] };
				}),
			);
		};

		window.addEventListener("mousemove", moveListener);
		window.addEventListener(
			"mouseup",
			() => {
				window.removeEventListener("mousemove", moveListener);
			},
			{ once: true },
		);
	};

	return (
		<div ref={ref}>
			<div className={styles.columnHeadingContainer}>
				<div className={styles.columnHeadingExpander} />
				{boundColumns.map((column, index) => (
					<div
						key={index}
						style={{ width: `${column.width}px` }}
						className={styles.columnHeading}
					>
						<span className={styles.columnName}>{column.attribute}</span>
						<span
							className={styles.mover}
							onMouseDown={(e) => startDrag(e as any, index)}
						/>
					</div>
				))}
			</div>
			<Virtuoso
				className={styles.trackList}
				customScrollParent={scrollParent}
				data={tracks}
				itemContent={(index, track) => (
					<ListTrack
						track={track}
						columns={boundColumns}
						number={trackNumbers?.[index]}
						noArt={noArt}
					/>
				)}
			/>
		</div>
	);
}
