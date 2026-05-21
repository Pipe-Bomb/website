"use client";

import styles from "./text-input.module.scss";

interface Props {
	value: string;
	onChange?: (value: string) => void;
	password?: boolean;
	placeholder?: string;
	onEnter?: () => void;
	autoFocus?: boolean;
}

export function TextInput({
	value,
	onChange,
	password,
	placeholder,
	onEnter,
	autoFocus,
}: Props) {
	return (
		<span>
			<input
				value={value}
				onChange={(e) => onChange?.(e.currentTarget.value)}
				className={styles.input}
				type={password ? "password" : "text"}
				placeholder={placeholder}
				autoFocus={autoFocus}
				onKeyDown={(e) => {
					if (e.code == "Enter") {
						onEnter?.();
					}
				}}
			/>
		</span>
	);
}
