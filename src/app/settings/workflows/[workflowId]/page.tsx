"use client";

import { useGetWorkflow, Workflow } from "@api";
import { use, useMemo, useState } from "react";
import { Spinner } from "@/components/spinner/spinner.component";
import { useButtonMenu } from "@/hook/button-menu.hook";
import { AddWorkflowTriggerModal } from "@/modal/add-workflow-trigger/add-workflow-trigger.modal";
import styles from "./page.module.scss";
import { IconButton } from "@/components/icon-button/icon-button";
import { IconDots } from "@tabler/icons-react";
import { ListWorkflowStep } from "@/components/list-workflow-step/list-workflow-step.component";
import { AddWorkflowStepModal } from "@/modal/add-workflow-step/add-workflow-step.modal";
import { ContextMenuElement } from "@/context/context-menu.context";
import { usePrivilegeCheck } from "@/hook/privilege-check.hook";

interface Props {
	params: Promise<{
		workflowId: string;
	}>;
}

export default function Page({ params }: Props) {
	const { workflowId } = use(params);

	const { data: response, isLoading, isError } = useGetWorkflow(workflowId);

	if (isLoading) {
		return <Spinner position="expand" size="lg" />;
	}

	if (isError || !response || response.status !== 200) {
		const statusCode = response?.status ?? "Unknown";
		return <h1>Error {statusCode}</h1>;
	}

	const workflow = response.data;

	return <Contents workflow={workflow} />;
}

interface InnerProps {
	workflow: Workflow;
}

export function Contents({ workflow }: InnerProps) {
	const [triggerAddOpen, setTriggerAddOpen] = useState(false);
	const [stepAddOpen, setStepAddOpen] = useState(false);
	const hasPrivilege = usePrivilegeCheck();

	const canEditWorkflows = hasPrivilege("edit-workflows");
	const menuElements = useMemo<ContextMenuElement[]>(() => {
		const elements: ContextMenuElement[] = [];
		if (canEditWorkflows) {
			elements.push(
				{
					key: "add-trigger",
					text: "Add trigger",
					onClick: () => setTriggerAddOpen(true),
				},
				{
					key: "add-step",
					text: "Add step",
					onClick: () => setStepAddOpen(true),
				},
			);
		}
		return elements;
	}, [canEditWorkflows]);

	const contextMenu = useButtonMenu(() => menuElements);

	return (
		<>
			<div>
				<div className={styles.top}>
					<h1 className={styles.name}>{workflow.name}</h1>
					{!!menuElements.length && (
						<IconButton
							icon={IconDots}
							iconSource="tabler"
							onClick={contextMenu.onClick}
						/>
					)}
				</div>
				<div className={styles.stepContainer}>
					{workflow.steps?.map((step) => (
						<div className={styles.step} key={step.uuid}>
							<ListWorkflowStep step={step} canEdit={canEditWorkflows} />
						</div>
					))}
				</div>
			</div>
			<AddWorkflowTriggerModal
				open={triggerAddOpen}
				onClose={() => setTriggerAddOpen(false)}
				workflow={workflow}
			/>
			<AddWorkflowStepModal
				open={stepAddOpen}
				onClose={() => setStepAddOpen(false)}
				workflow={workflow}
			/>
		</>
	);
}
