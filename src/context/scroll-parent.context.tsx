"use client";

import { createContext, ReactNode, useContext, useState } from "react";

const ScrollParentContext = createContext<{
	scrollParent: HTMLDivElement | undefined;
	setScrollParent: (parent: HTMLDivElement | null) => void;
} | null>(null);

interface ScrollParentProviderProps {
	children: ReactNode;
	className?: string;
}

export function ScrollParentProvider({
	children,
	className,
}: ScrollParentProviderProps) {
	const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null);

	return (
		<ScrollParentContext.Provider
			value={{ scrollParent: scrollParent ?? undefined, setScrollParent }}
		>
			<div ref={setScrollParent} className={className}>
				{children}
			</div>
		</ScrollParentContext.Provider>
	);
}

export function useScrollParentContext() {
	const context = useContext(ScrollParentContext);
	if (!context) {
		throw new Error(
			"useScrollParentContext must be used within ScrollParentProvider",
		);
	}
	return context;
}
