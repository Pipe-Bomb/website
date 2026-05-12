"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ModalContextType {
	register: (id: string, closeFn: () => void) => void;
	unregister: (id: string) => void;
	closeTop: () => void;
	activeCount: number;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [stack, setStack] = useState<{ id: string; close: () => void }[]>([]);

	const register = useCallback((id: string, close: () => void) => {
		setStack((prev) => [
			...prev.filter((item) => item.id !== id),
			{ id, close },
		]);
	}, []);

	const unregister = useCallback((id: string) => {
		setStack((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const closeTop = useCallback(() => {
		const top = stack[stack.length - 1];
		if (top) top.close();
	}, [stack]);

	return (
		<ModalContext.Provider
			value={{ register, unregister, closeTop, activeCount: stack.length }}
		>
			{children}
		</ModalContext.Provider>
	);
}

export const useModals = () => {
	const ctx = useContext(ModalContext);
	if (!ctx) throw new Error("useModals must be used within ModalProvider");
	return ctx;
};
