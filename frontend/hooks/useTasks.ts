"use client";

import { useState, useCallback, useRef } from "react";
import { taskApi, Task, TaskCreate, TaskUpdate, ApiError } from "@/services/api";

interface UseTasksReturn {
    tasks: Task[];
    isLoading: boolean;
    error: string;
    loadTasks: () => Promise<void>;
    createTask: (data: TaskCreate) => Promise<Task | null>;
    updateTask: (id: number, data: TaskUpdate) => Promise<Task | null>;
    deleteTask: (id: number) => Promise<boolean>;
    toggleComplete: (id: number) => Promise<boolean>;
    clearError: () => void;
    setError: (error: string) => void;
}

export function useTasks(): UseTasksReturn {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Debounce toggle requests to prevent rapid clicks
    const toggleDebounceRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const DEBOUNCE_MS = 300;

    const clearError = useCallback(() => {
        setError("");
    }, []);

    const loadTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            setError("");
            const data = await taskApi.list();
            setTasks(data);
        } catch (err: any) {
            if (err.message === "Not authenticated" || err.message === "Session expired") {
                // Auth errors are handled by API client redirect
                return;
            }
            const errorMessage = err instanceof ApiError
                ? err.userMessage
                : "Failed to load tasks. Please try again.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createTask = useCallback(async (data: TaskCreate): Promise<Task | null> => {
        try {
            setError("");
            const createdTask = await taskApi.create(data);
            setTasks(prev => [...prev, createdTask]);
            return createdTask;
        } catch (err: any) {
            const errorMessage = err instanceof ApiError
                ? err.userMessage
                : "Failed to create task. Please try again.";
            setError(errorMessage);
            return null;
        }
    }, []);

    const updateTask = useCallback(async (id: number, data: TaskUpdate): Promise<Task | null> => {
        // Store original for rollback
        const originalTask = tasks.find(t => t.id === id);

        // Optimistic update
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...data } : task
        ));

        try {
            setError("");
            const updatedTask = await taskApi.update(id, data);
            setTasks(prev => prev.map(task =>
                task.id === id ? updatedTask : task
            ));
            return updatedTask;
        } catch (err: any) {
            // Rollback on error
            if (originalTask) {
                setTasks(prev => prev.map(task =>
                    task.id === id ? originalTask : task
                ));
            }
            const errorMessage = err instanceof ApiError
                ? err.userMessage
                : "Failed to update task. Please try again.";
            setError(errorMessage);
            return null;
        }
    }, [tasks]);

    const deleteTask = useCallback(async (id: number): Promise<boolean> => {
        // Store original for rollback
        const originalTasks = [...tasks];

        // Optimistic update
        setTasks(prev => prev.filter(task => task.id !== id));

        try {
            setError("");
            await taskApi.delete(id);
            return true;
        } catch (err: any) {
            // Rollback on error
            setTasks(originalTasks);
            const errorMessage = err instanceof ApiError
                ? err.userMessage
                : "Failed to delete task. Please try again.";
            setError(errorMessage);
            return false;
        }
    }, [tasks]);

    const toggleComplete = useCallback(async (id: number): Promise<boolean> => {
        // Cancel pending debounced toggle for this task
        const existingTimeout = toggleDebounceRef.current.get(id);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            toggleDebounceRef.current.delete(id);
        }

        // Find current task state
        const currentTask = tasks.find(t => t.id === id);
        if (!currentTask) return false;

        // Optimistic update - toggle immediately for <500ms feedback (SC-003)
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));

        return new Promise((resolve) => {
            const timeout = setTimeout(async () => {
                toggleDebounceRef.current.delete(id);

                try {
                    setError("");
                    const updatedTask = await taskApi.toggleComplete(id);
                    // Sync with server response
                    setTasks(prev => prev.map(task =>
                        task.id === id ? updatedTask : task
                    ));
                    resolve(true);
                } catch (err: any) {
                    // Rollback on error
                    setTasks(prev => prev.map(task =>
                        task.id === id ? { ...task, completed: currentTask.completed } : task
                    ));
                    const errorMessage = err instanceof ApiError
                        ? err.userMessage
                        : "Failed to update task. Please try again.";
                    setError(errorMessage);
                    resolve(false);
                }
            }, DEBOUNCE_MS);

            toggleDebounceRef.current.set(id, timeout);
        });
    }, [tasks]);

    return {
        tasks,
        isLoading,
        error,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        clearError,
        setError
    };
}
