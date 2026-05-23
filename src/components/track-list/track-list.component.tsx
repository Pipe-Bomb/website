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

	const boundColumns = useMemo<AttributeColumn[]>(() => {
		if (!width) {
			return [];
		}
		if (width < MAIN_MIN_WIDTH + columns.length * COLUMN_MIN_WIDTH) {
			return []; // todo: better responsiveness
		}
		const targetWidth =
			columns.reduce((width, column) => width + column.width, 0) + 200;
		if (width >= targetWidth) {
			return columns;
		}
		// intelligently resize columns

		const extraSpace =
			width - MAIN_MIN_WIDTH - columns.length * COLUMN_MIN_WIDTH;
		return columns.map((column) => ({
			...column,
			width: COLUMN_MIN_WIDTH + (extraSpace / targetWidth) * column.width,
		}));
	}, [columns, width]);

	const startDrag = (e: MouseEvent, index: number) => {
		const mover = e.currentTarget as HTMLSpanElement | null;
		if (!mover) {
			return;
		}

		const startX = e.clientX;
		const initialWidth = columns[index].width;

		const moveListener = (e: MouseEvent) => {
			const offset = e.pageX - startX;

			setColumns((columns) => [
				...columns.map((column, columnIndex) => {
					if (columnIndex == index) {
						return {
							...column,
							width: Math.max(initialWidth - offset, 50),
						};
					}
					return column;
				}),
			]);
		};

		window.addEventListener("mousemove", moveListener);

		window.addEventListener(
			"mouseup",
			(e) => {
				window.removeEventListener("mousemove", moveListener);
			},
			{
				once: true,
			},
		);
	};

	return (
		<div ref={ref}>
			<div className={styles.columnHeadingContainer}>
				<div className={styles.columnHeadingExpander} />
				{boundColumns.map((column, index) => (
					<div
						key={index}
						style={{
							width: `${column.width}px`,
						}}
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
			<List>
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
			</List>
		</div>
	);
}
