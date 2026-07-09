"use client";

import { Ref } from "react";
import styles from "./text-input.module.scss";

interface Props {
	value: string;
	onChange?: (value: string) => void;
	password?: boolean;
	placeholder?: string;
	onBlur?: () => void;
	onEnter?: () => void;
	autoFocus?: boolean;
	disabled?: boolean;
	ref?: Ref<HTMLInputElement>;
}

export function TextInput({
	value,
	onChange,
	password,
	placeholder,
	onEnter,
	onBlur,
	autoFocus,
	disabled,
	ref,
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
				disabled={disabled}
				ref={ref}
				onBlur={onBlur}
			/>
		</span>
	);
}
