"use client";

import { ListTask } from "@/components/list-task/list-task.component";
import { useGetTasks } from "@api";
import styles from "./page.module.scss";
import { Spinner } from "@/components/spinner/spinner.component";
import { List } from "@/components/list/list.component";

export default function Page() {
	const { data: tasksResponse } = useGetTasks({
		query: {
			enabled: true,
			refetchInterval: 3000,
		},
	});

	if (!tasksResponse) {
		return <Spinner position="expand" />;
	}

	const tasks = tasksResponse.data;

	return (
		<List>
			{tasks.systemTasks.map((task) => (
				<ListTask task={task} key={task.uuid} />
			))}
			{tasks.pluginTasks.map((task) => (
				<ListTask task={task} key={task.uuid} />
			))}
		</List>
	);
}
