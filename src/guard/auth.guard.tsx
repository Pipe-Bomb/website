"use client";

import { LoginComponent } from "@/components/login/login.component";
import { useAuth } from "@/context/auth.context";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

export function RequireAuth({ children }: Props) {
	const user = useAuth();

	if (user) {
		return children;
	}

	return <LoginComponent />;
}
