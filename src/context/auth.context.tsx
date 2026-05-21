"use client";

import { User } from "@/api";
import { createContext, useContext } from "react";

const AuthContext = createContext<User | null>(null);

export function AuthProvider({
	user,
	children,
}: {
	user: User | null;
	children: React.ReactNode;
}) {
	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
