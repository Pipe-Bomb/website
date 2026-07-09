import { createContext, ReactNode, useContext } from "react";

export interface WorkflowContextType {
	stepIndex: number;
	stepUuid: string;
	totalSteps: number;
	stepPercent: number | null;
}

const WorkflowProgressContext = createContext<Record<
	string,
	WorkflowContextType
> | null>(null);

export function WorkflowProgressProvider({
	children,
	data,
}: {
	children: ReactNode;
	data: Record<string, WorkflowContextType>;
}) {
	return (
		<WorkflowProgressContext.Provider value={data}>
			{children}
		</WorkflowProgressContext.Provider>
	);
}

export function useWorkflowProgress(uuid: string): WorkflowContextType | null {
	const context = useContext(WorkflowProgressContext);
	if (!context) {
		throw new Error(
			"useWorkflowProgress must be used within WorkflowProgressProvider",
		);
	}

	return context[uuid] ?? null;
}
