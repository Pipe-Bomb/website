import { Modal } from "@/components/modal/modal.component";
import { useTranslation } from "@/context/language.context";
import { useRankedAttributes } from "@/hook/ranked-attributes.hook";
import { AttributeEntity, SmartPlaylistFilterGroup } from "@api";
import { useEffect, useMemo, useState } from "react";
import styles from "./create-filter-group.module.scss";
import { Dropdown } from "@/components/dropdown/dropdown.component";
import { Spinner } from "@/components/spinner/spinner.component";
import {
	BooleanAttributeFilterConfig,
	BufferAttributeFilterConfig,
	DecimalAttributeFilterConfig,
	IntegerAttributeFilterConfig,
	StringAttributeFilterConfig,
} from "@/modal/create-filter-group/attribute-filter-config.component";
import { Button } from "@/components/button/button.component";
import { SmartFilterDto } from "@/interface/smart-filter.dto";
import { useAttributeFilterDescription } from "@/hook/attribute-filter-description.hook";
import { SmartFilterListEntry } from "@/components/smart-filter-list-entry/smart-filter-list-entry.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconCancel, IconPlus, IconTrash } from "@tabler/icons-react";

interface Props extends InnerProps {
	open: boolean;
	onClose?: () => void;
}

export function CreateFilterGroupModal({
	open,
	onClose,
	existingGroup,
	onSave,
	isSaving,
}: Props) {
	return (
		<Modal open={open} onClose={onClose}>
			<Inner
				existingGroup={existingGroup}
				onSave={onSave}
				isSaving={isSaving}
			/>
		</Modal>
	);
}

interface InnerProps {
	existingGroup?: SmartPlaylistFilterGroup | null;
	onSave: (filters: SmartFilterDto[]) => void;
	isSaving: boolean;
}

function Inner({ existingGroup, onSave, isSaving }: InnerProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editingFilter, setEditingFilter] = useState<SmartFilterDto | null>(
		null,
	);

	const [filters, setFilters] = useState<SmartFilterDto[]>([]);

	useEffect(() => {
		if (!existingGroup) {
			setFilters([]);
			return;
		}

		setFilters(
			existingGroup.filters.map((filter) => {
				switch (filter.attributeType) {
					case "boolean":
						return {
							...filter,
							value: filter.value ?? undefined,
						};

					case "string":
						return { ...filter, value: filter.value ?? undefined };
					case "decimal":
					case "integer":
						return {
							...filter,
							value: filter.value ?? undefined,
							min: filter.min ?? undefined,
							max: filter.max ?? undefined,
						};
					case "buffer":
						return { ...filter };
					default:
						throw new Error("Not implemented");
				}
			}),
		);
	}, [existingGroup]);

	useEffect(() => {
		if (!isEditing) {
			setEditingFilter(null);
		}
	}, [isEditing]);

	if (isEditing) {
		return (
			<CreateFilter
				filter={editingFilter}
				onCreate={(dto) => {
					setFilters((filters) => [...filters, dto]);
					setIsEditing(false);
				}}
				onRemove={() => {
					if (editingFilter) {
						setFilters((filters) =>
							filters.filter((filter) => filter != editingFilter),
						);
						setIsEditing(false);
					}
				}}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className={styles.overviewContainer}>
			<div className={styles.filterList}>
				{filters.map((filter, index) => (
					<SmartFilterListEntry
						filter={filter}
						key={index}
						onEdit={() => {
							setEditingFilter(filter);
							setIsEditing(true);
						}}
					/>
				))}
			</div>
			<div className={styles.buttons}>
				<Button
					onClick={() => setIsEditing(true)}
					style="secondary"
					disabled={isSaving}
				>
					Add Filter
				</Button>
				<Button onClick={() => onSave(filters)} loading={isSaving}>
					Save
				</Button>
			</div>
		</div>
	);
}

interface CreateFilterProps {
	filter: SmartFilterDto | null;
	onCreate: (dto: SmartFilterDto) => void;
	onRemove: () => void;
	onCancel: () => void;
}

function CreateFilter({
	onCreate,
	filter,
	onRemove,
	onCancel,
}: CreateFilterProps) {
	const { t } = useTranslation();

	const [entityTypeDropdownOpen, setEntityTypeDropdownOpen] = useState(false);
	const [attributeDropdownOpen, setAttributeDropdownOpen] = useState(false);
	useEffect(() => {
		if (entityTypeDropdownOpen) {
			setAttributeDropdownOpen(false);
		}
	}, [entityTypeDropdownOpen]);
	useEffect(() => {
		if (attributeDropdownOpen) {
			setEntityTypeDropdownOpen(false);
		}
	}, [attributeDropdownOpen]);

	const [selectedAttributeKey, setSelectedAttributeKey] = useState<
		string | null
	>(null);

	const [entityType, setEntityType] = useState<AttributeEntity>("track");

	const rankedAttributes = useRankedAttributes(entityType);
	const [selectedAttribute, selectedAttributeName] = useMemo(() => {
		if (!selectedAttributeKey || !rankedAttributes) {
			return [null, null];
		}
		const attribute = rankedAttributes.find(
			(attribute) => attribute.key == selectedAttributeKey,
		);
		if (attribute) {
			return [
				attribute,
				t(
					`plugin.${attribute.pluginId}.attribute.${entityType}.${attribute.sourceId}.${attribute.key}.name`,
					attribute.key,
				),
			];
		}
		return [null, null];
	}, [selectedAttributeKey, rankedAttributes, entityType]);

	const [filterDto, setFilterDto] = useState<SmartFilterDto | null>(null);
	const description = useAttributeFilterDescription(filterDto);

	useEffect(() => {
		setFilterDto(null);
	}, [selectedAttribute]);

	useEffect(() => {
		setEntityTypeDropdownOpen(false);
		setAttributeDropdownOpen(false);
	}, [entityType, selectedAttributeKey]);

	if (!rankedAttributes) {
		return <Spinner position="expand" />;
	}

	return (
		<div className={styles.filterEditContainer}>
			<div className={styles.filterEditSplit}>
				<div className={styles.attributeDropdowns}>
					<Dropdown
						open={entityTypeDropdownOpen}
						onToggle={setEntityTypeDropdownOpen}
						className={styles.dropdown}
						onChange={(entry) => setEntityType(entry.key as AttributeEntity)}
						entries={[
							{
								key: "track",
								content: "Track",
							},
							{
								key: "artist",
								content: "Artist",
							},
							{
								key: "album",
								content: "Album",
							},
						]}
						selected={entityType}
					/>
					<Dropdown
						open={attributeDropdownOpen}
						onToggle={setAttributeDropdownOpen}
						className={styles.dropdown}
						onChange={(entry) => setSelectedAttributeKey(entry.key)}
						entries={rankedAttributes.map((attribute) => ({
							t: `plugin.${attribute.pluginId}.attribute.${entityType}.${attribute.sourceId}.${attribute.key}.name`,
							key: `${attribute.key}`,
							content: attribute.key,
						}))}
						selected={selectedAttributeKey}
					/>
				</div>

				{selectedAttribute && selectedAttributeName ? (
					<div className={styles.optionsSection}>
						{selectedAttribute.type == "string" && (
							<StringAttributeFilterConfig
								attribute={selectedAttribute}
								attributeName={selectedAttributeName}
								entityType={entityType}
								onChange={setFilterDto}
							/>
						)}
						{selectedAttribute.type == "boolean" && (
							<BooleanAttributeFilterConfig
								attribute={selectedAttribute}
								attributeName={selectedAttributeName}
								entityType={entityType}
								onChange={setFilterDto}
							/>
						)}
						{selectedAttribute.type == "integer" && (
							<IntegerAttributeFilterConfig
								attribute={selectedAttribute}
								attributeName={selectedAttributeName}
								entityType={entityType}
								onChange={setFilterDto}
							/>
						)}
						{selectedAttribute.type == "decimal" && (
							<DecimalAttributeFilterConfig
								attribute={selectedAttribute}
								attributeName={selectedAttributeName}
								entityType={entityType}
								onChange={setFilterDto}
							/>
						)}
						{selectedAttribute.type == "buffer" && (
							<BufferAttributeFilterConfig
								attribute={selectedAttribute}
								attributeName={selectedAttributeName}
								entityType={entityType}
								onChange={setFilterDto}
							/>
						)}
					</div>
				) : (
					<div className={styles.optionsSection}>
						<span>Select an Attribute</span>
					</div>
				)}
			</div>
			<div className={styles.bottom}>
				<span className={styles.description}>{description}</span>
				<div className={styles.buttons}>
					{filter && (
						<IconButton
							icon={IconTrash}
							iconSource="tabler"
							onClick={onRemove}
						/>
					)}
					<IconButton
						icon={IconCancel}
						iconSource="tabler"
						onClick={onCancel}
					/>
					<IconButton
						icon={IconPlus}
						iconSource="tabler"
						style="background"
						disabled={!filterDto}
						onClick={filterDto && (() => onCreate(filterDto))}
					/>
				</div>
			</div>
		</div>
	);
}
