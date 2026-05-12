"use client";

import { IconButton } from "@/components/icon-button/icon-button";
import { Task, TaskStatus } from "@api/model";
import {
	Icon,
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
	IconPlayerStopFilled,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import styles from "./list-task.module.scss";
import { ProgressBar } from "@/components/progress-bar/progress-bar.component";
import { useTranslation } from "@/context/language.context";
import { useQueryClient } from "@tanstack/react-query";
import { getGetTasksQueryKey, startTask } from "@api";

interface Props {
	task: Task;
}

export function ListTask({ task }: Props) {
	const [isLoading, setIsLoading] = useState(false);
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const buttonIcon = useMemo<Icon>(() => {
		if (
			task.status == TaskStatus.stopped ||
			task.status == TaskStatus.suspended
		) {
			return IconPlayerPlayFilled;
		}
		if (task.resumable) {
			return IconPlayerPauseFilled;
		}
		return IconPlayerStopFilled;
	}, [task.status, task.resumable]);

	const start = () => {
		if (isLoading) {
			return;
		}
		setIsLoading(true);
		startTask(task.uuid)
			.then((response) => {
				queryClient.invalidateQueries({ queryKey: getGetTasksQueryKey() });
			})
			.catch((e) => {
				console.error(`Error while starting task:`, e);
			})
			.finally(() => setIsLoading(false));
	};

	return (
		<div className={styles.container}>
			<IconButton
				icon={buttonIcon}
				style="background"
				onClick={() => {
					if (task.status == TaskStatus.running) {
						console.log("Cancelling task"); // todo: implement
					} else {
						start();
					}
				}}
				loading={isLoading}
			/>
			<div className={styles.right}>
				<span className={styles.source}>
					{task.pluginId ? t(`plugin.${task.pluginId}.name`) : t("task.system")}
				</span>
				<span>
					{task.pluginId
						? t(`task.plugin.${task.pluginId}.${task.taskId}.name`)
						: t(`task.system.${task.taskId}.name`)}
				</span>
				{task.status != TaskStatus.stopped && (
					<ProgressBar percent={task.percent} loading={task.percent === null} />
				)}
			</div>
		</div>
	);
}
