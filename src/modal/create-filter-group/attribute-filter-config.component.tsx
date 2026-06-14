import {
	BooleanSmartFilterDto,
	DecimalSmartFilterDto,
	IntegerSmartFilterDto,
	LoadedAttribute,
	StringSmartFilterDto,
} from "@/api";
import styles from "./create-filter-group.module.scss";
import { useEffect, useMemo, useState } from "react";
import { TextInput } from "@/components/text-input/text-input.component";
import { Checkbox } from "@/components/checkbox/checkbox.component";
import { Dropdown } from "@/components/dropdown/dropdown.component";
import { SmartFilterDto } from "@/interface/smart-filter.dto";

interface OptionsProps {
	attribute: LoadedAttribute;
	attributeName: string;
	entityType: "track" | "artist" | "album";
	onChange?: (attribute: SmartFilterDto | null) => void;
}

export function StringAttributeFilterConfig({
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
		const setting: StringSmartFilterDto = {
			attributeType: "string",
			attributeKey: attribute.key,
			entityType,
			inverse: false,
		};

		if (value) {
			setting.value = value;
			setting.partial = partial;
		}

		onChange?.(setting);
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

export function BooleanAttributeFilterConfig({
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
		const setting: BooleanSmartFilterDto = {
			attributeType: "boolean",
			attributeKey: attribute.key,
			entityType,
			inverse: false,
		};

		if (value != "any") {
			setting.value = value == "true";
		}

		onChange?.(setting);
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

export function IntegerAttributeFilterConfig({
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
		const setting: IntegerSmartFilterDto = {
			attributeType: "integer",
			entityType,
			attributeKey: attribute.key,
			inverse: false,
		};

		if (value !== null) {
			setting.value = value;
		} else {
			if (min !== null) {
				setting.min = min;
			}
			if (max !== null) {
				setting.max = max;
			}
		}

		onChange?.(setting);
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

export function DecimalAttributeFilterConfig({
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
		const setting: DecimalSmartFilterDto = {
			attributeType: "decimal",
			entityType,
			attributeKey: attribute.key,
			inverse: false,
		};

		if (value !== null) {
			setting.value = value;
		} else {
			if (min !== null) {
				setting.min = min;
			}
			if (max !== null) {
				setting.max = max;
			}
		}

		onChange?.(setting);
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

export function BufferAttributeFilterConfig({
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
		onChange?.({
			entityType,
			attributeKey: attribute.key,
			attributeType: "buffer",
			inverse: !checked,
		});
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
