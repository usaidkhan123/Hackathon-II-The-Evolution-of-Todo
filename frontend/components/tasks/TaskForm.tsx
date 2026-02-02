"use client";

import { useState, useEffect, FormEvent } from "react";

interface TaskFormProps {
    mode: "create" | "edit";
    initialTitle?: string;
    initialDescription?: string;
    onSubmit: (title: string, description: string) => void;
    onCancel?: () => void;
    isLoading?: boolean;
    className?: string;
}

export function TaskForm({
    mode,
    initialTitle = "",
    initialDescription = "",
    onSubmit,
    onCancel,
    isLoading = false,
    className = ""
}: TaskFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [error, setError] = useState("");

    // Update form when initial values change (for edit mode)
    useEffect(() => {
        setTitle(initialTitle);
        setDescription(initialDescription);
    }, [initialTitle, initialDescription]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        onSubmit(title.trim(), description.trim());

        // Only clear form for create mode
        if (mode === "create") {
            setTitle("");
            setDescription("");
        }
    };

    const isCreateMode = mode === "create";

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor={`task-title-${mode}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Title *
                </label>
                <input
                    id={`task-title-${mode}`}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                    disabled={isLoading}
                    autoFocus={!isCreateMode}
                />
            </div>

            <div>
                <label
                    htmlFor={`task-description-${mode}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Description
                </label>
                <textarea
                    id={`task-description-${mode}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task description (optional)"
                    rows={isCreateMode ? 3 : 2}
                    disabled={isLoading}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="min-h-[44px] min-w-[44px] px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading
                        ? (isCreateMode ? "Adding..." : "Saving...")
                        : (isCreateMode ? "Add Task" : "Save Changes")
                    }
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="min-h-[44px] min-w-[44px] px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
