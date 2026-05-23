"use client";

import { ListTrack } from "@/components/list-track/list-track.component";
import { List } from "@/components/list/list.component";
import { EphemeralTrack, Track } from "@api";
import styles from "./track-list.module.scss";
import { useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import {
	AttributeColumn,
	useTrackColumns,
} from "@/context/track-columns.context";

interface Props {
	tracks: (Track | EphemeralTrack)[];
	keys?: (string | number)[];
	trackNumbers?: number[];
	noArt?: boolean;
}

const MAIN_MIN_WIDTH = 200;
const COLUMN_MIN_WIDTH = 50;

export function TrackList({ tracks, keys, trackNumbers, noArt }: Props) {
	const { columns, setColumns } = useTrackColumns();
	const { ref, width } = useResizeDetector();

	// 1. Compute visible columns based on available space budget
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

	// 2. Optimized Drag Handler with hard-boundary locking
	const startDrag = (e: MouseEvent, index: number) => {
		const mover = e.currentTarget as HTMLSpanElement | null;
		if (!mover || !width) {
			return;
		}

		const startX = e.clientX;

		// Capture snapshot of current VISIBLE widths when drag starts.
		// This prevents columns from "snapping" if they were previously squished by a small window.
		const currentVisibleWidths = boundColumns.map((c) => c.width);
		const initialWidth = currentVisibleWidths[index];

		// Calculate the maximum space available for ALL columns
		const maxAvailableColumnSpace = width - MAIN_MIN_WIDTH;

		// Sum up what the OTHER columns are currently taking up on screen
		const otherColumnsWidth = currentVisibleWidths.reduce(
			(sum, w, idx) => sum + (idx === index ? 0 : w),
			0,
		);

		// This is the absolute largest this column can grow before violating MAIN_MIN_WIDTH
		const maxPossibleWidth = maxAvailableColumnSpace - otherColumnsWidth;

		const moveListener = (e: MouseEvent) => {
			const offset = e.clientX - startX;

			// Calculate raw target width based on your direction configuration
			let newWidth = initialWidth - offset;

			// Clamp: Must be at least COLUMN_MIN_WIDTH, and cannot exceed our calculated budget wall
			newWidth = Math.max(
				COLUMN_MIN_WIDTH,
				Math.min(newWidth, maxPossibleWidth),
			);

			setColumns((prevColumns) =>
				prevColumns.map((column, columnIndex) => {
					if (columnIndex === index) {
						return { ...column, width: newWidth };
					}
					// Crucial: Lock all other columns to their exact current visible widths
					// during active drag states to eliminate unexpected layout shifting.
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
			<div className={styles.trackList}>
				{tracks.map((track, index) => (
					<ListTrack
						track={track}
						key={
							keys
								? keys[index]
								: `${track.pluginId} ${track.libraryId} ${track.id}`
						}
						columns={boundColumns}
						number={trackNumbers?.[index]}
						noArt={noArt}
					/>
				))}
			</div>
		</div>
	);
}
