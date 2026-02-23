"use client";

import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

interface MobileMenuContextValue {
	sidebar: ReactNode | null;
	setSidebar: (sidebar: ReactNode | null) => void;
	closeMenu: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextValue | undefined>(
	undefined,
);

export const MobileMenuProvider = ({ children }: { children: ReactNode }) => {
	const [sidebar, setSidebar] = useState<ReactNode | null>(null);

	const handleSetSidebar = useCallback((content: ReactNode | null) => {
		setSidebar(content);
	}, []);

	const closeMenu = useCallback(() => {
		const closeButton = document.querySelector(
			'[data-state="open"] [aria-label="关闭菜单"]',
		) as HTMLButtonElement | null;
		if (closeButton) {
			closeButton.click();
		}
	}, []);

	const value = useMemo(
		() => ({ sidebar, setSidebar: handleSetSidebar, closeMenu }),
		[sidebar, handleSetSidebar, closeMenu],
	);

	return (
		<MobileMenuContext.Provider value={value}>
			{children}
		</MobileMenuContext.Provider>
	);
};

export const useMobileMenu = () => {
	const context = useContext(MobileMenuContext);
	if (!context) {
		throw new Error("useMobileMenu must be used within MobileMenuProvider");
	}
	return context;
};
