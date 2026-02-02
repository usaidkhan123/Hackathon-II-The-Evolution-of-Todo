"use client";

import { Task } from "@/services/api";
import { TaskItem } from "./TaskItem";
import { EmptyState } from "./EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface TaskListProps {
    tasks: Task[];
    isLoading: boolean;
    onToggleComplete: (id: number) => void;
    onUpdate: (id: number, title: string, description: string) => Promise<boolean>;
    onDelete: (id: number) => void;
    className?: string;
}

export function TaskList({
    tasks,
    isLoading,
    onToggleComplete,
    onUpdate,
    onDelete,
    className = ""
}: TaskListProps) {
    if (isLoading) {
        return (
            <div className={`py-8 ${className}`}>
                <LoadingSpinner size="lg" message="Loading tasks..." />
            </div>
        );
    }

    if (tasks.length === 0) {
        return <EmptyState className={className} />;
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
