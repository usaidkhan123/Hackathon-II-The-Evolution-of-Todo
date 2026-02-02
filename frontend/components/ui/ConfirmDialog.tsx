"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: "danger" | "primary";
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmVariant = "primary",
    onConfirm,
    onCancel,
    isLoading = false
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            confirmButtonRef.current?.focus();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isLoading) {
                onCancel();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, isLoading, onCancel]);

    if (!isOpen) return null;

    const confirmClasses = confirmVariant === "danger"
        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isLoading) {
                    onCancel();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div
                ref={dialogRef}
                className="w-full max-w-md bg-white rounded-lg shadow-xl"
            >
                <div className="p-6">
                    <h2
                        id="dialog-title"
                        className="text-lg font-semibold text-gray-900"
                    >
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {message}
                    </p>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmButtonRef}
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmClasses}`}
                    >
                        {isLoading ? "Processing..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
