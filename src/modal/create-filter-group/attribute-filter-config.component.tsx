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
	entityType: "track" | "artist" | "album";
	onChange?: (attribute: SmartFilterDto | null) => void;
	initialFilter: SmartFilterDto | null;
}

export function StringAttributeFilterConfig({
	attribute,
	onChange,
	entityType,
	initialFilter,
}: OptionsProps) {
	const [value, setValue] = useState("");
	const [partial, setPartial] = useState<boolean>(
		initialFilter?.attributeType == "string" ? !!initialFilter.partial : false,
	);
	const [inverse, setInverse] = useState<boolean>(
		(initialFilter?.attributeType == "string" && initialFilter.inverse) ??
			false,
	);

	useEffect(() => {
		setValue("");
		setPartial(false);
		setInverse(false);
	}, [attribute]);

	useEffect(() => {
		if (initialFilter?.attributeType == "string") {
			setValue(initialFilter.value ?? "");
			setPartial(!!initialFilter.partial);
			setInverse(initialFilter.inverse);
		}
	}, [initialFilter]);

	useEffect(() => {
		const setting: StringSmartFilterDto = {
			attributeType: "string",
			attributeKey: attribute.key,
			entityType,
			inverse,
		};

		if (value) {
			setting.value = value;
			setting.partial = partial;
		}

		onChange?.(setting);
	}, [attribute, value, partial, inverse]);

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
				<span className={styles.optionName}>Inverse</span>
				<Checkbox checked={inverse} onChange={setInverse} />
			</div>
		</>
	);
}

export function BooleanAttributeFilterConfig({
	attribute,
	onChange,
	entityType,
	initialFilter,
}: OptionsProps) {
	const [value, setValue] = useState<"any" | "true" | "false">(
		initialFilter?.attributeType == "boolean"
			? typeof initialFilter.value == "boolean"
				? initialFilter.value
					? "true"
					: "false"
				: "any"
			: "any",
	);
	const [inverse, setInverse] = useState<boolean>(
		(initialFilter?.attributeType == "boolean" && initialFilter.inverse) ??
			false,
	);

	useEffect(() => {
		setValue("any");
		setInverse(false);
	}, [attribute]);

	useEffect(() => {
		if (initialFilter?.attributeType == "boolean") {
			if (typeof initialFilter.value == "boolean") {
				if (initialFilter.value) {
					setValue("true");
				} else {
					setValue("false");
				}
			} else {
				setValue("any");
			}
			setInverse(initialFilter.inverse);
		}
	}, [initialFilter]);

	useEffect(() => {
		const setting: BooleanSmartFilterDto = {
			attributeType: "boolean",
			attributeKey: attribute.key,
			entityType,
			inverse,
		};

		if (value != "any") {
			setting.value = value == "true";
		}

		onChange?.(setting);
	}, [value, inverse, entityType]);

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
				<span className={styles.optionName}>Inverse</span>
				<Checkbox checked={inverse} onChange={setInverse} />
			</div>
		</>
	);
}

export function IntegerAttributeFilterConfig({
	attribute,
	onChange,
	entityType,
	initialFilter,
}: OptionsProps) {
	const [rawValue, setRawValue] = useState<string>(
		initialFilter?.attributeType == "integer"
			? (initialFilter.value?.toString() ?? "")
			: "",
	);
	const [rawMin, setRawMin] = useState<string>(
		initialFilter?.attributeType == "integer"
			? (initialFilter.min?.toString() ?? "")
			: "",
	);
	const [rawMax, setRawMax] = useState<string>(
		initialFilter?.attributeType == "integer"
			? (initialFilter.max?.toString() ?? "")
			: "",
	);
	const [inverse, setInverse] = useState<boolean>(
		(initialFilter?.attributeType == "integer" && initialFilter.inverse) ??
			false,
	);

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
			inverse,
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
	}, [value, min, max, inverse, entityType]);

	useEffect(() => {
		setRawValue("");
		setRawMin("");
		setRawMax("");
		setInverse(false);
	}, [attribute]);

	useEffect(() => {
		if (initialFilter?.attributeType == "integer") {
			if (typeof initialFilter.value == "number") {
				setRawValue(initialFilter.value.toString());
			} else {
				setRawValue("");
			}
			if (typeof initialFilter.min == "number") {
				setRawMin(initialFilter.min.toString());
			} else {
				setRawMin("");
			}
			if (typeof initialFilter.max == "number") {
				setRawMax(initialFilter.max.toString());
			} else {
				setRawMax("");
			}

			setInverse(initialFilter.inverse);
		}
	}, [initialFilter]);

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
				<span className={styles.optionName}>Inverse</span>
				<Checkbox checked={inverse} onChange={setInverse} />
			</div>
		</>
	);
}

export function DecimalAttributeFilterConfig({
	attribute,
	onChange,
	entityType,
	initialFilter,
}: OptionsProps) {
	const [rawValue, setRawValue] = useState<string>(
		initialFilter?.attributeType == "decimal"
			? (initialFilter.value?.toString() ?? "")
			: "",
	);
	const [rawMin, setRawMin] = useState<string>(
		initialFilter?.attributeType == "decimal"
			? (initialFilter.min?.toString() ?? "")
			: "",
	);
	const [rawMax, setRawMax] = useState<string>(
		initialFilter?.attributeType == "decimal"
			? (initialFilter.max?.toString() ?? "")
			: "",
	);
	const [inverse, setInverse] = useState<boolean>(
		(initialFilter?.attributeType == "decimal" && initialFilter.inverse) ??
			false,
	);

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
	}, [value, min, max, inverse, entityType]);

	useEffect(() => {
		setRawValue("");
		setRawMin("");
		setRawMax("");
		setInverse(false);
	}, [attribute]);

	useEffect(() => {
		if (initialFilter?.attributeType == "integer") {
			if (typeof initialFilter.value == "number") {
				setRawValue(initialFilter.value.toString());
			} else {
				setRawValue("");
			}
			if (typeof initialFilter.min == "number") {
				setRawMin(initialFilter.min.toString());
			} else {
				setRawMin("");
			}
			if (typeof initialFilter.max == "number") {
				setRawMax(initialFilter.max.toString());
			} else {
				setRawMax("");
			}

			setInverse(initialFilter.inverse);
		}
	}, [initialFilter]);

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
				<span className={styles.optionName}>Inverse</span>
				<Checkbox checked={inverse} onChange={setInverse} />
			</div>
		</>
	);
}

export function BufferAttributeFilterConfig({
	attribute,
	onChange,
	entityType,
	initialFilter,
}: OptionsProps) {
	const [inverse, setInverse] = useState<boolean>(
		(initialFilter?.attributeType == "buffer" && initialFilter.inverse) ??
			false,
	);

	useEffect(() => {
		setInverse(false);
	}, [attribute]);

	useEffect(() => {
		if (initialFilter?.attributeType == "buffer") {
			setInverse(initialFilter.inverse);
		}
	}, [initialFilter]);

	useEffect(() => {
		onChange?.({
			entityType,
			attributeKey: attribute.key,
			attributeType: "buffer",
			inverse,
		});
	}, [inverse, entityType]);

	return (
		<>
			<div className={styles.option}>
				<span className={styles.optionName}>Inverse</span>
				<Checkbox checked={inverse} onChange={setInverse} />
			</div>
		</>
	);
}
