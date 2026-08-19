import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react";
import styles from "./system-config-entry.module.scss";
import { useTranslation } from "@/context/language.context";
import { SystemConfigUnion } from "@/lib/system-config.util";
import {
	BooleanSystemConfigOption,
	DecimalSystemConfigOption,
	IntegerSystemConfigOption,
	StringSystemConfigOption,
} from "@api";
import { Checkbox } from "@/components/checkbox/checkbox.component";
import { TextInput } from "@/components/text-input/text-input.component";

interface Props {
	option: SystemConfigUnion;
	values: string[] | number[] | boolean[];
	setValues: (values: string[] | number[] | boolean[]) => void;
}

export function SystemConfigEntry({ option, values, setValues }: Props) {
	const { t } = useTranslation();

	// const [values, setValues] = useState(option.values);
	const entryFactory = useMemo(() => {
		const creators: Record<
			typeof option.type,
			(props: InputProps<any>, key: any) => ReactNode
		> = {
			boolean: (props: InputProps<BooleanSystemConfigOption>, key) => (
				<BooleanConfigEntry {...props} key={key} />
			),
			string: (props: InputProps<StringSystemConfigOption>, key) => (
				<StringConfigEntry {...props} key={key} />
			),
			integer: (props: InputProps<IntegerSystemConfigOption>, key) => (
				<IntegerConfigEntry {...props} key={key} />
			),
			decimal: (props: InputProps<DecimalSystemConfigOption>, key) => (
				<DecimalConfigEntry {...props} key={key} />
			),
		};
		const creator = creators[option.type];
		return (value: any, setValue: (value: any) => void, key: any) =>
			creator({ option, value, setValue }, key);
	}, [option]);

	return (
		<div className={styles.container}>
			<span className={styles.name}>
				{t(`config.system.${option.key}.name`)}
			</span>
			<div className={styles.split}>
				<div className={styles.inputContainer}>
					{values.map((value, index) =>
						entryFactory(
							value,
							(value) =>
								setValues(values.map((v, i) => (i == index ? value : v))),
							index,
						),
					)}
				</div>
				<span className={styles.description}>
					{t(`config.system.${option.key}.description`)}
				</span>
			</div>
		</div>
	);
}

interface InputProps<
	T extends SystemConfigUnion,
	V extends T["values"][0] = T["values"][0],
> {
	value: V;
	setValue: (value: V) => void;
	option: T;
}

function BooleanConfigEntry({
	option,
	value,
	setValue,
}: InputProps<BooleanSystemConfigOption>) {
	return <Checkbox checked={value} onChange={setValue} />;
}

function StringConfigEntry({
	option,
	value,
	setValue,
}: InputProps<StringSystemConfigOption>) {
	return <TextInput value={value} onChange={setValue} />;
}

function IntegerConfigEntry({
	option,
	value,
	setValue,
}: InputProps<IntegerSystemConfigOption>) {
	const [inputValue, setInputValue] = useState(value.toString());
	const [error, setError] = useState("");

	useEffect(() => setInputValue(value.toString()), [value]);

	const handleChange = (val: string) => {
		if (val === "") {
			setInputValue("");
			setError("");
			return;
		}

		if (val == "-") {
			setInputValue(val);
		}

		if (/^-?\d+$/.test(val)) {
			const parsed = parseInt(val, 10);
			if (!isNaN(parsed)) {
				setInputValue(val);

				if (option.min !== null && parsed < option.min) {
					return setError(`Value can not be less than ${option.min}`);
				}
				if (option.max !== null && parsed > option.max) {
					return setError(`Value can not be greater than ${option.min}`);
				}

				setValue(parsed);
				setError("");
				return;
			}
		}

		setInputValue(value.toString());
	};

	return (
		<div>
			{!!error && <span>{error}</span>}
			<TextInput value={inputValue} onChange={handleChange} />
		</div>
	);
}

function DecimalConfigEntry({
	option,
	value,
	setValue,
}: InputProps<DecimalSystemConfigOption>) {
	const [inputValue, setInputValue] = useState(value.toString());
	const [error, setError] = useState("");

	useEffect(() => setInputValue(value.toString()), [value]);

	const handleChange = (val: string) => {
		if (val === "") {
			setInputValue("");
			setError("");
			return;
		}

		if (!/^-?\d*\.?\d*$/.test(val)) {
			setInputValue(value.toString());
			return;
		}

		setInputValue(val);

		if (val === "-" || val === "." || val === "-." || val.endsWith(".")) {
			return;
		}

		const parsed = parseInt(val, 10);
		if (!isNaN(parsed) && Number.isFinite(parsed)) {
			setInputValue(val);

			if (option.min !== null && parsed < option.min) {
				return setError(`Value can not be less than ${option.min}`);
			}
			if (option.max !== null && parsed > option.max) {
				return setError(`Value can not be greater than ${option.min}`);
			}

			setValue(parsed);
			setError("");
		} else {
			setInputValue(value.toString());
		}
	};

	return (
		<div>
			{!!error && <span>{error}</span>}
			<TextInput value={inputValue} onChange={handleChange} />
		</div>
	);
}
