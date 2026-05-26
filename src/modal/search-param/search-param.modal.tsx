import { Checkbox } from "@/components/checkbox/checkbox.component";
import { Dropdown } from "@/components/dropdown/dropdown.component";
import { Modal } from "@/components/modal/modal.component";
import { Spinner } from "@/components/spinner/spinner.component";
import { useRankedAttributes } from "@/hook/ranked-attributes.hook";
import { SearchAttributeDto } from "@/interface/search-attribute-dto.interface";
import { LoadedAttribute } from "pipe-bomb-tanstack-client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import styles from "./search-param.module.scss";
import { useTranslation } from "@/context/language.context";
import { Button } from "@/components/button/button.component";
import { TextInput } from "@/components/text-input/text-input.component";

interface Props extends InnerProps {
	open: boolean;
	onClose?: () => void;
}

export function SearchParamModal({ open, onClose, ...props }: Props) {
	return (
		<Modal open={open} onClose={onClose}>
			<Inner {...props} />
		</Modal>
	);
}

interface InnerProps {
	onSetting?: (setting: SearchAttributeDto, name: string) => void;
}

function Inner({ onSetting }: InnerProps) {
	const { t } = useTranslation();
	const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
	const [media, setMedia] = useState<"track" | "artist" | "album">("track");
	useEffect(() => {
		setMediaDropdownOpen(false);
	}, [media]);

	const [attributeDropdownOpen, setAttributeDropdownOpen] = useState(false);
	useEffect(() => {
		if (mediaDropdownOpen) {
			setAttributeDropdownOpen(false);
		}
	}, [mediaDropdownOpen]);
	const [selectedAttributeKey, setSelectedAttributeKey] = useState<
		string | null
	>(null);
	useEffect(() => {
		setAttributeDropdownOpen(false);
	}, [selectedAttributeKey]);

	useEffect(() => {
		if (attributeDropdownOpen) {
			setMediaDropdownOpen(false);
		}
	}, [attributeDropdownOpen]);

	const rankedAttributes = useRankedAttributes(media);

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
					`plugin.${attribute.pluginId}.attribute.${media}.${attribute.sourceId}.${attribute.key}.name`,
					attribute.key,
				),
			];
		}
		return [null, null];
	}, [selectedAttributeKey, rankedAttributes]);

	const [attributeSetting, setAttributeSetting] = useState<
		[SearchAttributeDto, string] | null
	>(null);
	useLayoutEffect(() => {
		setAttributeSetting(null);
	}, [selectedAttribute]);

	if (!rankedAttributes) {
		return <Spinner position="expand" />;
	}

	return (
		<div className={styles.container}>
			<div className={styles.dropdowns}>
				<Dropdown
					open={mediaDropdownOpen}
					onToggle={setMediaDropdownOpen}
					onChange={(entry) => setMedia(entry.key as typeof media)}
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
					selected={media}
				/>
				<Dropdown
					open={attributeDropdownOpen}
					onToggle={setAttributeDropdownOpen}
					onChange={(entry) => setSelectedAttributeKey(entry.key)}
					entries={rankedAttributes.map((attribute) => ({
						t: `plugin.${attribute.pluginId}.attribute.${media}.${attribute.sourceId}.${attribute.key}.name`,
						key: `${attribute.key}`,
						content: attribute.key,
					}))}
					selected={selectedAttributeKey}
				/>
			</div>

			{selectedAttribute && selectedAttributeName ? (
				<div className={styles.optionsSection}>
					{selectedAttribute.type == "string" && (
						<StringOptions
							attribute={selectedAttribute}
							attributeName={selectedAttributeName}
							entityType={media}
							onChange={(attribute, name) =>
								setAttributeSetting(
									attribute && name ? [attribute, name] : null,
								)
							}
						/>
					)}
					{selectedAttribute.type == "boolean" && (
						<BooleanOptions
							attribute={selectedAttribute}
							attributeName={selectedAttributeName}
							entityType={media}
							onChange={(attribute, name) =>
								setAttributeSetting(
									attribute && name ? [attribute, name] : null,
								)
							}
						/>
					)}
					{selectedAttribute.type == "integer" && (
						<IntegerOptions
							attribute={selectedAttribute}
							attributeName={selectedAttributeName}
							entityType={media}
							onChange={(attribute, name) =>
								setAttributeSetting(
									attribute && name ? [attribute, name] : null,
								)
							}
						/>
					)}
					{selectedAttribute.type == "decimal" && (
						<DecimalOptions
							attribute={selectedAttribute}
							attributeName={selectedAttributeName}
							entityType={media}
							onChange={(attribute, name) =>
								setAttributeSetting(
									attribute && name ? [attribute, name] : null,
								)
							}
						/>
					)}
					{selectedAttribute.type == "buffer" && (
						<BufferOptions
							attribute={selectedAttribute}
							attributeName={selectedAttributeName}
							entityType={media}
							onChange={(attribute, name) =>
								setAttributeSetting(
									attribute && name ? [attribute, name] : null,
								)
							}
						/>
					)}
					<div className={styles.searchButton}>
						<Button
							disabled={!attributeSetting}
							onClick={
								attributeSetting && (() => onSetting?.(...attributeSetting))
							}
						>
							Search
						</Button>
					</div>
				</div>
			) : (
				<div className={styles.optionsSection}>
					<span>Select an Attribute</span>
				</div>
			)}
		</div>
	);
}

interface OptionsProps {
	attribute: LoadedAttribute;
	attributeName: string;
	entityType: "track" | "artist" | "album";
	onChange?: (
		attribute: SearchAttributeDto | null,
		name: string | null,
	) => void;
}

function StringOptions({
	attribute,
	attributeName,
	onChange,
	entityType,
}: OptionsProps) {
	const [value, setValue] = useState("");
	const [partial, setPartial] = useState(false);
	const [exists, setExists] = useState(true);

	useEffect(() => {
		setValue("");
		setPartial(false);
		setExists(true);
	}, [attribute]);

	useEffect(() => {
		const setting: SearchAttributeDto = {
			type: "string",
			key: attribute.key,
			entityType,
		};

		if (!value) {
			setting.exists = exists;
			return onChange?.(
				setting,
				`${exists ? "Has" : "Doesn't have"} ${attributeName}`,
			);
		}

		setting.query = value;
		setting.partial = partial;
		let name: string;
		if (partial) {
			name = `${attributeName} contains "${value}"`;
		} else {
			name = `${attributeName} is "${value}"`;
		}
		onChange?.(setting, name);
	}, [attribute, attributeName, value, partial, exists]);

	return (
		<>
			<div className={styles.option}>
				<span className={styles.optionName}>Query</span>
				<TextInput
					value={value}
					onChange={setValue}
					placeholder={partial ? "Partial query" : "Exact query"}
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Partial</span>
				<Checkbox checked={partial} onChange={setPartial} />
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Exists</span>
				<Checkbox checked={!!value || exists} onChange={setExists} />
			</div>
		</>
	);
}

function BooleanOptions({
	attribute,
	attributeName,
	onChange,
	entityType,
}: OptionsProps) {
	const [value, setValue] = useState<"any" | "true" | "false">("any");
	const [exists, setExists] = useState(true);

	useEffect(() => {
		setValue("any");
		setExists(true);
	}, [attribute]);

	useEffect(() => {
		const setting: SearchAttributeDto = {
			type: "boolean",
			key: attribute.key,
			entityType,
		};

		let name: string;

		if (value == "any") {
			setting.exists = exists;
			name = `${attributeName} ${exists ? "exists" : "doesn't exist"}`;
		} else {
			setting.boolean = value == "true";
			name = `${attributeName} is ${setting.boolean ? "True" : "False"}`;
		}

		onChange?.(setting, name);
	}, [value, exists, entityType, attributeName]);

	return (
		<>
			<div className={styles.option}>
				<span className={styles.optionName}>Value</span>
				<Dropdown
					entries={[
						{
							content: "Any",
							key: "any",
						},
						{
							content: "True",
							key: "true",
						},
						{
							content: "False",
							key: "false",
						},
					]}
					selected={value}
					onChange={(entry) => setValue(entry.key as typeof value)}
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Exists</span>
				<Checkbox checked={value != "any" || exists} onChange={setExists} />
			</div>
		</>
	);
}

function IntegerOptions({
	attribute,
	attributeName,
	onChange,
	entityType,
}: OptionsProps) {
	const [rawValue, setRawValue] = useState<string>("");
	const [rawMin, setRawMin] = useState<string>("");
	const [rawMax, setRawMax] = useState<string>("");
	const [exists, setExists] = useState(true);

	const [value, min, max] = useMemo(() => {
		const parse = (value: string) => {
			if (!value.trim()) {
				return null;
			}
			const number = parseInt(value.trim());
			if (isNaN(number)) {
				return null;
			}
			return number;
		};

		if (rawValue.trim()) {
			return [parse(rawValue), null, null];
		}
		const min = parse(rawMin);
		const max = parse(rawMax);

		if (max && min) {
			if (max == min) {
				return [max, null, null];
			}
			if (max < min) {
				return [null, null, null];
			}
		}
		return [null, min, max];
	}, [rawValue, rawMin, rawMax]);

	useEffect(() => {
		const setting: SearchAttributeDto = {
			type: "decimal",
			entityType,
			key: attribute.key,
		};

		if (value === null && min === null && max === null) {
			setting.exists = exists;
			return onChange?.(
				setting,
				`${exists ? "Has" : "Doesn't have"} ${attributeName}`,
			);
		}

		let name: string;
		if (value !== null) {
			setting.decimal = value;
			name = `${attributeName} is ${value}`;
		} else {
			if (min !== null) {
				setting.min = min;
				name = `${attributeName} >= ${min}`;
			}
			if (max !== null) {
				setting.max = max;
				if (min !== null) {
					name! += ` and <= ${max}`;
				} else {
					name = `${attributeName} <= ${max}`;
				}
			}
		}
		onChange?.(setting, name!);
	}, [value, min, max, exists, entityType, attributeName]);

	useEffect(() => {
		setRawValue("");
		setRawMin("");
		setRawMax("");
		setExists(true);
	}, [attribute]);

	return (
		<>
			<div className={styles.option}>
				<span className={styles.optionName}>Value</span>
				<TextInput
					value={rawValue}
					onChange={setRawValue}
					placeholder="Exact value"
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Min</span>
				<TextInput
					value={rawMin}
					onChange={setRawMin}
					placeholder="Minimum value"
					disabled={!!rawValue}
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Max</span>
				<TextInput
					value={rawMax}
					onChange={setRawMax}
					placeholder="Maximum value"
					disabled={!!rawValue}
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Exists</span>
				<Checkbox
					checked={value !== null || min !== null || max !== null || exists}
					onChange={setExists}
				/>
			</div>
		</>
	);
}

function DecimalOptions({
	attribute,
	attributeName,
	onChange,
	entityType,
}: OptionsProps) {
	const [rawValue, setRawValue] = useState<string>("");
	const [rawMin, setRawMin] = useState<string>("");
	const [rawMax, setRawMax] = useState<string>("");
	const [exists, setExists] = useState(true);

	const [value, min, max] = useMemo(() => {
		const parse = (value: string) => {
			if (!value.trim()) {
				return null;
			}
			const number = parseFloat(value.trim());
			if (isNaN(number)) {
				return null;
			}
			return number;
		};

		if (rawValue.trim()) {
			return [parse(rawValue), null, null];
		}
		const min = parse(rawMin);
		const max = parse(rawMax);

		if (max && min) {
			if (max == min) {
				return [max, null, null];
			}
			if (max < min) {
				return [null, null, null];
			}
		}
		return [null, min, max];
	}, [rawValue, rawMin, rawMax]);

	useEffect(() => {
		const setting: SearchAttributeDto = {
			type: "decimal",
			entityType,
			key: attribute.key,
		};

		if (value === null && min === null && max === null) {
			setting.exists = exists;
			return onChange?.(
				setting,
				`${exists ? "Has" : "Doesn't have"} ${attributeName}`,
			);
		}

		let name: string;
		if (value !== null) {
			setting.decimal = value;
			name = `${attributeName} is ${value}`;
		} else {
			if (min !== null) {
				setting.min = min;
				name = `${attributeName} >= ${min}`;
			}
			if (max !== null) {
				setting.max = max;
				if (min !== null) {
					name! += ` and <= ${max}`;
				} else {
					name = `${attributeName} <= ${max}`;
				}
			}
		}
		onChange?.(setting, name!);
	}, [value, min, max, exists, entityType, attributeName]);

	useEffect(() => {
		setRawValue("");
		setRawMin("");
		setRawMax("");
		setExists(true);
	}, [attribute]);

	return (
		<>
			<div className={styles.option}>
				<span className={styles.optionName}>Value</span>
				<TextInput
					value={rawValue}
					onChange={setRawValue}
					placeholder="Exact value"
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Min</span>
				<TextInput
					value={rawMin}
					onChange={setRawMin}
					placeholder="Minimum value"
					disabled={!!rawValue}
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Max</span>
				<TextInput
					value={rawMax}
					onChange={setRawMax}
					placeholder="Maximum value"
					disabled={!!rawValue}
				/>
			</div>
			<div className={styles.option}>
				<span className={styles.optionName}>Exists</span>
				<Checkbox
					checked={value !== null || min !== null || max !== null || exists}
					onChange={setExists}
				/>
			</div>
		</>
	);
}

function BufferOptions({
	attribute,
	attributeName,
	onChange,
	entityType,
}: OptionsProps) {
	const [checked, setChecked] = useState(false);
	useEffect(() => {
		setChecked(false);
	}, [attribute]);
	useEffect(() => {
		onChange?.(
			{
				type: "buffer",
				key: attribute.key,
				exists: checked,
				entityType,
			},
			`${checked ? "Has" : "Doesn't have"} ${attributeName}`,
		);
	}, [checked, entityType, attributeName]);

	return (
		<>
			<div className={styles.option}>
				<span className={styles.optionName}>Exists</span>
				<Checkbox checked={checked} onChange={setChecked} />
			</div>
		</>
	);
}
