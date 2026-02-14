"use client";

import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface MobileSidebarContextType {
	sidebarContentFactory:
		| ((onLinkClick: () => void) => React.ReactNode)
		| undefined;
	setSidebarContentFactory: (
		factory: ((onLinkClick: () => void) => React.ReactNode) | undefined,
	) => void;
}

const MobileSidebarContext = createContext<
	MobileSidebarContextType | undefined
>(undefined);

export const useMobileSidebar = () => {
	const context = useContext(MobileSidebarContext);
	if (context === undefined) {
		throw new Error(
			"useMobileSidebar must be used within a MobileSidebarProvider",
		);
	}
	return context;
};

interface MobileSidebarProviderProps {
	children: React.ReactNode;
}

export const MobileSidebarProvider = ({
	children,
}: MobileSidebarProviderProps) => {
	const [sidebarContentFactory, setSidebarContentFactory] = useState<
		((onLinkClick: () => void) => React.ReactNode) | undefined
	>(undefined);

	const contextValue = useMemo(
		() => ({
			sidebarContentFactory,
			setSidebarContentFactory,
		}),
		[sidebarContentFactory],
	);

	return (
		<MobileSidebarContext.Provider value={contextValue}>
			{children}
		</MobileSidebarContext.Provider>
	);
};
