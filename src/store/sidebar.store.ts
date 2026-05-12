import { create } from "zustand";

interface SidebarStore {
	open: boolean;
	setOpen: (open: boolean) => void;
	toggle: () => void;
}

export const useSidebarStore = create<SidebarStore>((set, get) => ({
	open: false,
	setOpen: (open) => set({ open }),
	toggle: () =>
		set(({ open }) => ({
			open: !open,
		})),
}));
