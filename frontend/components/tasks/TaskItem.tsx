"use client";

import { useState } from "react";
import { Task } from "@/services/api";
import { TaskForm } from "./TaskForm";

interface TaskItemProps {
    task: Task;
    onToggleComplete: (id: number) => void;
    onUpdate: (id: number, title: string, description: string) => Promise<boolean>;
    onDelete: (id: number) => void;
    isToggling?: boolean;
}

export function TaskItem({
    task,
    onToggleComplete,
    onUpdate,
    onDelete,
    isToggling = false
}: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (title: string, description: string) => {
        setIsUpdating(true);
        const success = await onUpdate(task.id, title, description);
        setIsUpdating(false);
        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className={`border rounded-lg p-4 bg-white border-blue-300`}>
                <TaskForm
                    mode="edit"
                    initialTitle={task.title}
                    initialDescription={task.description || ""}
                    onSubmit={handleUpdate}
                    onCancel={handleCancelEdit}
                    isLoading={isUpdating}
                />
            </div>
        );
    }

    return (
        <div
            className={`border rounded-lg p-4 transition-colors ${
                task.completed
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-300"
            }`}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox with 44px touch target */}
                <label className="relative flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleComplete(task.id)}
                        disabled={isToggling}
                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
                    />
                </label>

                <div className="flex-1 min-w-0">
                    <h3
                        className={`text-lg font-medium break-words ${
                            task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                        }`}
                    >
                        {task.title}
                    </h3>
                    {task.description && (
                        <p
                            className={`mt-1 text-sm break-words ${
                                task.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-600"
                            }`}
                        >
                            {task.description}
                        </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                        Created: {new Date(task.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <button
                    onClick={() => setIsEditing(true)}
                    className="min-h-[44px] min-w-[44px] px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="min-h-[44px] min-w-[44px] px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
