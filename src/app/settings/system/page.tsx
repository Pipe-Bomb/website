"use client";

import { Spinner } from "@/components/spinner/spinner.component";
import {
	getSystemConfigOptionsResponseSuccess,
	SystemConfigOptions,
	updateSystemConfigOptions,
	UpdateSystemConfigOptionsDto,
	useGetSystemConfigOptions,
} from "@api";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import { SystemConfigEntry } from "@/components/system-config-entry/system-config-entry.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { safeFetch } from "@/lib/api.util";
import { useNotificationStore } from "@/store/notification.store";

const KEYS = ["allow-user-registrations"];

export default function Page() {
	const { mutate, data } = useGetSystemConfigOptions();
	const { createNotification } = useNotificationStore();

	const [serverOptions, setServerOptions] = useState<
		SystemConfigOptions["options"] | null
	>(null);

	const [currentValues, setCurrentValues] = useState<
		Record<string, UpdateSystemConfigOptionsDto["options"][0]>
	>({});
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		mutate({ data: { keys: KEYS } });
	}, [mutate]);

	useEffect(() => {
		if (data?.status === 200 && !serverOptions) {
			const options = data.data.options;
			setServerOptions(options);

			const initialMap: Record<
				string,
				UpdateSystemConfigOptionsDto["options"][0]
			> = {};
			for (const option of options) {
				initialMap[option.key] = {
					key: option.key,
					type: option.type,
					values: option.values as any,
				};
			}
			setCurrentValues(initialMap);
		}
	}, [data, serverOptions]);

	const needsSaving = useMemo(() => {
		if (!serverOptions) return false;

		for (const option of serverOptions) {
			const dto = currentValues[option.key];
			if (!dto) return false;

			if (dto.type !== option.type) {
				console.error(
					`Type mismatch for system config option "${option.key}" (expected "${option.type}" but received "${dto.type}")`,
				);
				return true;
			}

			if (dto.values.length !== option.values.length) return true;

			for (let i = 0; i < dto.values.length; i++) {
				if (dto.values[i] !== option.values[i]) return true;
			}
		}
		return false;
	}, [serverOptions, currentValues]);

	if (!serverOptions) {
		return <Spinner position="expand" size="lg" />;
	}

	const saveChanges = async () => {
		if (isSaving || !needsSaving) {
			return;
		}
		setIsSaving(true);

		const optionsToUpdate = Object.values(currentValues);

		const [status, resData, response, error] = await safeFetch(
			updateSystemConfigOptions,
			{ options: optionsToUpdate },
		);
		setIsSaving(false);

		if (status === 200) {
			setServerOptions((prevOptions) =>
				prevOptions
					? prevOptions.map((opt) => ({
							...opt,
							values: (currentValues[opt.key]?.values ?? opt.values) as any,
						}))
					: null,
			);
		} else {
			createNotification("Failed to update system settings");
			console.error(error);
		}
	};

	return (
		<div>
			<div className={styles.serverOptions}>
				{serverOptions.map((option) => {
					const values = currentValues[option.key];
					if (!values) return null;

					return (
						<SystemConfigEntry
							option={option}
							key={option.key}
							values={values.values}
							setValues={(newValues) => {
								if (!isSaving) {
									setCurrentValues((prev) => ({
										...prev,
										[option.key]: {
											key: option.key,
											type: option.type,
											values: newValues as any,
										},
									}));
								}
							}}
						/>
					);
				})}
			</div>
			<div className={styles.saveContainer}>
				<IconButton
					icon={IconDeviceFloppy}
					iconSource="tabler"
					style={needsSaving ? "background" : "simple"}
					loading={isSaving}
					onClick={saveChanges}
				/>
			</div>
		</div>
	);
}
