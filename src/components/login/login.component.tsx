"use client";

import { useState } from "react";
import styles from "./login.module.scss";
import { TextInput } from "@/components/text-input/text-input.component";
import { useTranslation } from "@/context/language.context";
import { Button } from "@/components/button/button.component";
import { createUser, loginUser } from "@api";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notification.store";

export function LoginComponent() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [mode, setMode] = useState<"login" | "signup">("login");
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const { t } = useTranslation();
	const router = useRouter();
	const { createNotification } = useNotificationStore();

	const login = () => {
		if (!username || !password) {
			return;
		}

		setIsLoggingIn(true);

		if (mode == "login") {
			loginUser({ username, password })
				.then(() => router.refresh())
				.catch((e) => {
					console.error(e);
					if (e.status == 401) {
						createNotification("Incorrect username or password");
					} else if (typeof e.body?.message == "string") {
						createNotification(e.body.message);
					} else {
						createNotification("Something went wrong when logging in");
					}
				})
				.finally(() => setIsLoggingIn(false));
		} else {
			createUser({
				username,
				password,
			})
				.then(() => router.refresh())
				.catch((e) => {
					createNotification("Failed to create account");
					console.error(e);
				})
				.finally(() => setIsLoggingIn(false));
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<h1>{t(`login.title.${mode}`)}</h1>
				<TextInput
					value={username}
					onChange={(v) => isLoggingIn || setUsername(v)}
					placeholder="Username"
					onEnter={login}
					autoFocus
				/>
				<TextInput
					value={password}
					onChange={(v) => isLoggingIn || setPassword(v)}
					placeholder="Password"
					onEnter={login}
					password
				/>
				<div className={styles.buttons}>
					<Button
						t={`login.switch.${mode == "login" ? "signup" : "login"}`}
						onClick={() =>
							isLoggingIn ||
							setMode((mode) => (mode == "login" ? "signup" : "login"))
						}
						style="ghost"
					/>
					<Button
						t={`login.action.${mode}`}
						onClick={login}
						loading={isLoggingIn}
					/>
				</div>
			</div>
		</div>
	);
}
