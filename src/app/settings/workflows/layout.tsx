"use client";

import { ReactNode, useState } from "react";
import styles from "../layout.module.scss";
import Link from "next/link";
import {
	deleteWorkflow,
	getGetAllWorkflowsQueryKey,
	useGetAllWorkflows,
	Workflow,
} from "@api";
import { Spinner } from "@/components/spinner/spinner.component";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconPlus } from "@tabler/icons-react";
import { CreateWorkflowModal } from "@/modal/create-workflow/create-workflow.modal";
import { useRightClick } from "@/hook/right-click.hook";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

interface Props {
	children: ReactNode;
}

export default function Layout({ children }: Props) {
	const [createOpen, setCreateOpen] = useState(false);

	const workflowsResponse = useGetAllWorkflows({
		query: {
			enabled: true,
			refetchInterval: 3000,
		},
	});

	const workflows = workflowsResponse.data?.data;

	return (
		<>
			<div className={styles.container}>
				<div className={styles.sideBar}>
					<h3>Workflows</h3>
					<div className={styles.tabs}>
						{workflows ? (
							workflows.map((workflow) => (
								<WorkflowEntry workflow={workflow} key={workflow.uuid} />
							))
						) : (
							<Spinner />
						)}
					</div>
					<IconButton
						icon={IconPlus}
						iconSource="tabler"
						onClick={() => setCreateOpen(true)}
					/>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
			<CreateWorkflowModal
				open={createOpen}
				onClose={() => setCreateOpen(false)}
			/>
		</>
	);
}

interface WorkflowEntryProps {
	workflow: Workflow;
}

function WorkflowEntry({ workflow }: WorkflowEntryProps) {
	const queryClient = useQueryClient();
	const pathname = usePathname();
	const router = useRouter();

	const rightClick = useRightClick(() => [
		{
			key: "delete",
			text: "Delete workflow",
			onClick: () => {
				deleteWorkflow(workflow.uuid).then((response) => {
					if (response.status == 204) {
						queryClient.invalidateQueries({
							queryKey: getGetAllWorkflowsQueryKey(),
						});
						if (pathname == `/settings/workflows/${workflow.uuid}`) {
							router.push("/settings/workflows");
						}
					}
				});
			},
		},
	]);

	return (
		<>
			<Link
				href={`/settings/workflows/${workflow.uuid}`}
				key={workflow.uuid}
				{...rightClick}
			>
				{workflow.name}
			</Link>
		</>
	);
}
