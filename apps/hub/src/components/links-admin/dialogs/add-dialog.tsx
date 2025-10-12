"use client";

import { useState } from "react";
import type { LinksFormData, LinksItem } from "@/components/links/links-types";
import { LinksForm } from "@/components/links-admin/components/links-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AddDialogProps {
  /** 是否打开 */
  open: boolean;
  /** 打开状态变化回调 */
  onOpenChange: (open: boolean) => void;
  /** 成功回调 */
  onSuccess: (item: LinksItem) => void;
  /** 错误回调 */
  onError: (error: string) => void;
}

export const AddDialog = ({ open, onOpenChange, onSuccess, onError }: AddDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: LinksFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData: { error?: string } = (await response.json()) as {
          error?: string;
        };
        throw new Error(errorData.error ?? "Failed to add item");
      }

      const newItem: LinksItem = (await response.json()) as LinksItem;
      onSuccess(newItem);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error && error.message === "URL already exists") {
        onError("该网址已存在");
      } else {
        onError("添加网址失败");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="hide-scrollbar max-h-[90vh] max-w-2xl space-y-6 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">添加新网址</DialogTitle>
        </DialogHeader>
        <LinksForm
          submitAction={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
