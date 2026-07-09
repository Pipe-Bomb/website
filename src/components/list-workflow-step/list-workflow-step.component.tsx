"use client";

import {
	BooleanWorkflowStepOptionValue,
	DecimalWorkflowStepOptionValue,
	deleteWorkflowStep,
	EnumWorkflowStepOptionValue,
	getGetWorkflowQueryKey,
	IntegerWorkflowStepOptionValue,
	StringWorkflowStepOptionValue,
	updateWorkflowStepOptions,
	WorkflowStep,
} from "@api";
import styles from "./list-workflow-step.module.scss";
import { useTranslation } from "@/context/language.context";
import { useRightClick } from "@/hook/right-click.hook";
import { useMemo, useState } from "react";
import { useNotificationStore } from "@/store/notification.store";
import { safeFetch } from "@/lib/api.util";
import { useQueryClient } from "@tanstack/react-query";
import { TextInput } from "@/components/text-input/text-input.component";
import { Checkbox } from "@/components/checkbox/checkbox.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { Button } from "@/components/button/button.component";
import { SelectWorkflowStepModal } from "@/modal/select-workflow-step/select-workflow-step.modal";

interface Props {
	step: WorkflowStep;
}

export function ListWorkflowStep({ step }: Props) {
	const { t } = useTranslation();
	const [isDeleting, setIsDeleting] = useState(false);
	const { createNotification, updateNotification, resetNotificationTimeout } =
		useNotificationStore();
	const queryClient = useQueryClient();
	const baseLangKey = useMemo(() => {
		if (step.pluginId) {
			return `workflow.plugin.${step.pluginId}.step.${step.stepId}`;
		}
		return `workflow.system.step.${step.stepId}`;
	}, [step.pluginId, step.stepId]);
	const [options, setOptions] = useState(step.options ?? []);
	const needsSaving = useMemo(() => {
		for (const option of step.options ?? []) {
			const matchingOption = options.find((o) => o.id == option.id);
			if (matchingOption && matchingOption.value !== option.value) {
				return true;
			}
		}
		return false;
	}, [options, step.options]);
	const [isSaving, setIsSaving] = useState(false);

	const handleOptionChange = (
		optionId: string,
		value: string | boolean | number,
	) => {
		setOptions((options) =>
			options.map((option) => {
				if (option.id == optionId) {
					return {
						...option,
						value: value as any,
					};
				}
				return option;
			}),
		);
	};

	const rightClick = useRightClick(() => [
		{
			key: "delete",
			text: "Delete step",
			onClick: () => {
				if (isDeleting) {
					return;
				}
				setIsDeleting(true);
				const notificationId = createNotification("Deleting workflow step", {
					timeout: null,
					isLoading: true,
				});
				safeFetch(deleteWorkflowStep, step.workflowUuid, step.uuid).then(
					([status, _data, response]) => {
						resetNotificationTimeout(notificationId);

						if (status == 200) {
							updateNotification(notificationId, {
								message: "Deleted workflow step",
								isLoading: false,
							});
							queryClient.setQueryData(
								getGetWorkflowQueryKey(step.workflowUuid),
								response,
							);
						} else {
							updateNotification(notificationId, {
								message: "Failed to delete workflow step",
								isLoading: false,
							});
						}
					},
				);
			},
		},
	]);

	const saveOptions = () => {
		if (isSaving || !needsSaving) {
			return;
		}
		setIsSaving(true);

		safeFetch(updateWorkflowStepOptions, step.workflowUuid, step.uuid, {
			options,
		}).then(([status, _data, response]) => {
			setIsSaving(false);

			if (status == 200) {
				queryClient.setQueryData(
					getGetWorkflowQueryKey(step.workflowUuid),
					response,
				);
				createNotification("Updated step options");
			} else {
				createNotification("Failed to update step options");
			}
		});
	};

	return (
		<div className={styles.container} {...rightClick}>
			<div className={styles.topSplit}>
				<div className={styles.info}>
					<span className={styles.pluginName}>
						{t(
							step.pluginId
								? `plugin.${step.pluginId}.name`
								: "workflow.system",
						)}
					</span>
					<span className={styles.stepName}>{t(`${baseLangKey}.name`)}</span>
				</div>
				{needsSaving && (
					<IconButton
						icon={IconDeviceFloppy}
						iconSource="tabler"
						style="background"
						loading={isSaving}
						onClick={saveOptions}
					/>
				)}
			</div>

			{!!options.length && (
				<div className={styles.optionsList}>
					{options.map((option) => (
						<div key={option.id} className={styles.optionContainer}>
							<span className={styles.optionName}>
								{t(`${baseLangKey}.option.${option.id}.name`)}
							</span>
							<OptionContents
								option={option}
								onChange={(value) => handleOptionChange(option.id, value)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

interface OptionContentsProps {
	option:
		| StringWorkflowStepOptionValue
		| BooleanWorkflowStepOptionValue
		| IntegerWorkflowStepOptionValue
		| DecimalWorkflowStepOptionValue
		| EnumWorkflowStepOptionValue;
	onChange: (value: string | number | boolean) => void;
}

function OptionContents({ option, onChange }: OptionContentsProps) {
	if (option.type == "string") {
		return <StringOptionContents option={option} onChange={onChange} />;
	}

	if (option.type == "boolean") {
		return <BooleanOptionContents option={option} onChange={onChange} />;
	}

	if (option.type == "enum") {
		return <EnumOptionContents option={option} onChange={onChange} />;
	}

	return null;
}

interface SubContentsProps<T> {
	option: T;
	onChange: (value: string | number | boolean) => void;
}

function StringOptionContents({
	option,
	onChange,
}: SubContentsProps<StringWorkflowStepOptionValue>) {
	return (
		<TextInput
			value={option.value ?? ""}
			onChange={onChange}
			placeholder="Option value"
		/>
	);
}

function BooleanOptionContents({
	option,
	onChange,
}: SubContentsProps<BooleanWorkflowStepOptionValue>) {
	return <Checkbox checked={!!option.value} onChange={onChange} />;
}

function EnumOptionContents({
	option,
	onChange,
}: SubContentsProps<EnumWorkflowStepOptionValue>) {
	const [modalOpen, setModalOpen] = useState(false);
	const { t } = useTranslation();

	const selectedOption = useMemo(() => {
		if (option.value === null) {
			return null;
		}
		return option.options.find((o) => o.id == option.value) ?? null;
	}, [option.options, option.value]);

	return (
		<>
			<Button onClick={() => setModalOpen(true)} style="secondary">
				{selectedOption
					? selectedOption.languageKey
						? t(selectedOption.languageKey)
						: selectedOption.name || selectedOption.id
					: "Select"}
			</Button>
			<SelectWorkflowStepModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				options={option.options}
				onSelect={(id) => {
					setModalOpen(false);
					onChange(id);
				}}
			/>
		</>
	);
}
