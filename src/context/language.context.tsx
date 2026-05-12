"use client";

import { LanguageMap } from "@api/model";
import { createContext, useContext, ReactNode } from "react";

const LanguageContext = createContext<LanguageMap | null>(null);

export function LanguageProvider({
	children,
	data,
}: {
	children: ReactNode;
	data: LanguageMap;
}) {
	return (
		<LanguageContext.Provider value={data}>{children}</LanguageContext.Provider>
	);
}

export function useTranslation() {
	const context = useContext(LanguageContext);
	if (!context)
		throw new Error("useTranslation must be used within LanguageProvider");

	const t = (key: string) => context.keys[key] || key;

	return { t, langId: context.id };
}
