"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MobileMenuProps {
	children?: ReactNode;
	actions?: ReactNode;
}

export const MobileMenu = ({ children, actions }: MobileMenuProps) => {
	return (
		<DialogPrimitive.Root>
			<DialogPrimitive.Trigger asChild>
				<button
					type="button"
					className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
					aria-label="打开菜单"
				>
					<Menu className="size-5" />
				</button>
			</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in md:hidden" />
				<DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background p-4 data-[state=closed]:animate-slide-out-right data-[state=open]:animate-slide-in-right md:hidden">
					<DialogPrimitive.Title className="sr-only">
						菜单
					</DialogPrimitive.Title>
					<div className="flex items-center justify-between">
						<span className="font-semibold text-lg">菜单</span>
						<DialogPrimitive.Close asChild>
							<button
								type="button"
								className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
								aria-label="关闭菜单"
							>
								<X className="size-5" />
							</button>
						</DialogPrimitive.Close>
					</div>
					<div className="mt-6 space-y-6">
						{children}
						{actions && (
							<div className="flex items-center justify-center gap-4 border-t pt-4">
								{actions}
							</div>
						)}
					</div>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
};
