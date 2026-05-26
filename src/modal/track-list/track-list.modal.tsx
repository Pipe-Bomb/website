"use client";

import { useGetAllAttributes, useGetAllAttributeSources } from "@/api";
import { Modal } from "@/components/modal/modal.component";
import styles from "./track-list.module.scss";
import { Spinner } from "@/components/spinner/spinner.component";
import { useMemo } from "react";
import { cc, compare } from "@/lib/util";
import { useTranslation } from "@/context/language.context";
import { useTrackColumns } from "@/context/track-columns.context";
import { useRankedAttributes } from "@/hook/ranked-attributes.hook";

interface Props {
	open: boolean;
	onClose?: () => void;
}

export function TrackListModal({ open, onClose }: Props) {
	return (
		<Modal open={open} onClose={onClose}>
			<Inner />
		</Modal>
	);
}

function Inner() {
	const { t } = useTranslation();
	const { columns, setColumns } = useTrackColumns();

	const unorderedAttributes = useRankedAttributes("track");
	const rankedAttributes = useMemo(() => {
		return (unorderedAttributes ?? [])
			.map((attribute) => ({
				attribute,
				name: t(
					`plugin.${attribute.pluginId}.attribute.track.${attribute.sourceId}.${attribute.key}.name`,
					attribute.key,
				),
			}))
			.sort((a, b) => compare(a.name, b.name));
	}, [unorderedAttributes, t]);

	const allAttributesQuery = useGetAllAttributes({
		query: {
			enabled: true,
		},
	});

	const sourcesQuery = useGetAllAttributeSources({
		query: {
			enabled: true,
		},
	});

	if (
		allAttributesQuery.isPending ||
		!allAttributesQuery.data ||
		sourcesQuery.isPending ||
		!sourcesQuery.data
	) {
		return (
			<div className={styles.loading}>
				<Spinner position="expand" />
			</div>
		);
	}

	const attributesResponse = allAttributesQuery.data;
	const attributes = attributesResponse.data.track;

	const sources = sourcesQuery.data.data;

	return (
		<div>
			<h1>Columns</h1>
			<div className={styles.list}>
				{rankedAttributes.map(({ attribute, name }) => {
					const active = columns.some(
						(column) =>
							column.attribute == attribute.key &&
							column.attributeType == attribute.type,
					);

					return (
						<button
							key={attribute.key}
							className={cc(
								styles.attributeContainer,

								active && styles.active,
							)}
							onClick={() => {
								if (active) {
									setColumns(
										columns.filter(
											(column) =>
												column.attribute != attribute.key ||
												column.attributeType != attribute.type,
										),
									);
								} else {
									setColumns([
										{
											attribute: attribute.key,
											attributeType: attribute.type,
											width: 150,
										},
										...columns,
									]);
								}
							}}
						>
							<span className={styles.attributeName}>{name}</span>
							<span className={styles.attributeIndicator} />
						</button>
					);
				})}
			</div>
		</div>
	);
}
