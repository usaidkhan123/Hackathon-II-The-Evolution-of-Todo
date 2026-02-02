"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Validation limits (matching src/todo_app/core.py)
const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 1000;

interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
}

// localStorage key for tasks
const STORAGE_KEY = "taskflow_tasks";

export default function TodoPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [nextId, setNextId] = useState(1);

    // Load tasks from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setTasks(parsed.tasks || []);
                setNextId(parsed.nextId || 1);
            } catch {
                setTasks([]);
            }
        }
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, nextId }));
        }
    }, [tasks, nextId, mounted]);

    // Add Task
    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        const title = newTaskTitle.trim();
        const description = newTaskDescription.trim();

        if (!title) {
            setValidationError("Title is required");
            return;
        }
        if (title.length > TITLE_MAX_LENGTH) {
            setValidationError(`Title must be ${TITLE_MAX_LENGTH} characters or less`);
            return;
        }
        if (description.length > DESCRIPTION_MAX_LENGTH) {
            setValidationError(`Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`);
            return;
        }

        const newTask: Task = {
            id: nextId,
            title,
            description,
            completed: false,
            created_at: new Date().toISOString()
        };

        setTasks(prev => [...prev, newTask]);
        setNextId(prev => prev + 1);
        setNewTaskTitle("");
        setNewTaskDescription("");
        setShowAddForm(false);
        setValidationError("");
    };

    // Update Task
    const handleUpdateTask = (id: number) => {
        setValidationError("");

        const title = editTitle.trim();
        const description = editDescription.trim();

        if (!title) {
            setValidationError("Title cannot be empty");
            return;
        }
        if (title.length > TITLE_MAX_LENGTH) {
            setValidationError(`Title must be ${TITLE_MAX_LENGTH} characters or less`);
            return;
        }
        if (description.length > DESCRIPTION_MAX_LENGTH) {
            setValidationError(`Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`);
            return;
        }

        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, title, description } : task
        ));
        setEditingId(null);
        setValidationError("");
    };

    // Delete Task
    const handleDelete = (id: number) => {
        setTasks(prev => prev.filter(task => task.id !== id));
        setDeleteConfirm(null);
    };

    // Toggle Task Completion
    const toggleComplete = (id: number) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const startEditing = (task: Task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setValidationError("");
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const pendingCount = tasks.filter(t => !t.completed).length;

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Animated background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className={`relative z-10 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 ${mounted ? "animate-fade-in-down" : "opacity-0"}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-white hidden sm:block">TaskFlow</span>
                            </Link>
                        </div>
                        <nav className="flex items-center gap-2 sm:gap-4">
                            <Link
                                href="/todo"
                                className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-lg"
                            >
                                Todo
                            </Link>
                            <Link
                                href="/login"
                                className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="px-3 sm:px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
                            >
                                Sign Up
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Page Title */}
                <div className={`text-center mb-8 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Tasks</h1>
                    <p className="text-gray-400">Organize your tasks efficiently. Data is saved locally in your browser.</p>
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 ${mounted ? "animate-fade-in-up stagger-1" : "opacity-0"}`}>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-3xl font-bold text-white">{tasks.length}</p>
                        <p className="text-sm text-gray-400">Total Tasks</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-3xl font-bold text-indigo-400">{pendingCount}</p>
                        <p className="text-sm text-gray-400">In Progress</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-3xl font-bold text-green-400">{completedCount}</p>
                        <p className="text-sm text-gray-400">Completed</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-3xl font-bold text-purple-400">
                            {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                        </p>
                        <p className="text-sm text-gray-400">Progress</p>
                    </div>
                </div>

                {/* Add Task Button / Form */}
                <div className={`mb-8 ${mounted ? "animate-fade-in-up stagger-2" : "opacity-0"}`}>
                    {!showAddForm ? (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="w-full p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-indigo-500/50 text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-all duration-300 group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add new task
                        </button>
                    ) : (
                        <form onSubmit={handleCreateTask} className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-scale-in">
                            {validationError && (
                                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                                    {validationError}
                                </div>
                            )}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm text-gray-400">Title *</label>
                                    <span className={`text-xs ${newTaskTitle.length > TITLE_MAX_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                                        {newTaskTitle.length}/{TITLE_MAX_LENGTH}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="What needs to be done?"
                                    maxLength={TITLE_MAX_LENGTH + 1}
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                                        newTaskTitle.length > TITLE_MAX_LENGTH
                                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                    autoFocus
                                />
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="text-sm text-gray-400">Description (optional)</label>
                                    <span className={`text-xs ${newTaskDescription.length > DESCRIPTION_MAX_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                                        {newTaskDescription.length}/{DESCRIPTION_MAX_LENGTH}
                                    </span>
                                </div>
                                <textarea
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    placeholder="Add a description (optional)"
                                    rows={2}
                                    maxLength={DESCRIPTION_MAX_LENGTH + 1}
                                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                                        newTaskDescription.length > DESCRIPTION_MAX_LENGTH
                                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
                                    }`}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={!newTaskTitle.trim() || newTaskTitle.length > TITLE_MAX_LENGTH || newTaskDescription.length > DESCRIPTION_MAX_LENGTH}
                                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Task
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewTaskTitle("");
                                        setNewTaskDescription("");
                                        setValidationError("");
                                    }}
                                    className="px-6 py-2.5 text-gray-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Task List */}
                <div className={`space-y-3 ${mounted ? "animate-fade-in-up stagger-3" : "opacity-0"}`}>
                    {tasks.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
                            <p className="text-gray-400 mb-6">Create your first task to get started!</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                            >
                                Create your first task
                            </button>
                        </div>
                    ) : (
                        tasks.map((task, index) => (
                            <div
                                key={task.id}
                                className={`group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 task-item ${
                                    task.completed ? "opacity-60" : ""
                                }`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                {editingId === task.id ? (
                                    <div className="space-y-3">
                                        {validationError && (
                                            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-shake">
                                                {validationError}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs text-gray-400">Title</label>
                                                <span className={`text-xs ${editTitle.length > TITLE_MAX_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                                                    {editTitle.length}/{TITLE_MAX_LENGTH}
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                maxLength={TITLE_MAX_LENGTH + 1}
                                                className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white focus:outline-none ${
                                                    editTitle.length > TITLE_MAX_LENGTH
                                                        ? 'border-red-500/50 focus:border-red-500'
                                                        : 'border-white/10 focus:border-indigo-500'
                                                }`}
                                                autoFocus
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-xs text-gray-400">Description</label>
                                                <span className={`text-xs ${editDescription.length > DESCRIPTION_MAX_LENGTH ? 'text-red-400' : 'text-gray-500'}`}>
                                                    {editDescription.length}/{DESCRIPTION_MAX_LENGTH}
                                                </span>
                                            </div>
                                            <textarea
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                maxLength={DESCRIPTION_MAX_LENGTH + 1}
                                                className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white focus:outline-none resize-none ${
                                                    editDescription.length > DESCRIPTION_MAX_LENGTH
                                                        ? 'border-red-500/50 focus:border-red-500'
                                                        : 'border-white/10 focus:border-indigo-500'
                                                }`}
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdateTask(task.id)}
                                                disabled={!editTitle.trim() || editTitle.length > TITLE_MAX_LENGTH || editDescription.length > DESCRIPTION_MAX_LENGTH}
                                                className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setValidationError("");
                                                }}
                                                className="px-4 py-2 text-gray-400 hover:text-white text-sm rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4">
                                        <button
                                            onClick={() => toggleComplete(task.id)}
                                            className={`mt-0.5 w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                                                task.completed
                                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-transparent"
                                                    : "border-gray-600 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
                                            }`}
                                        >
                                            {task.completed && (
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`text-white font-medium transition-all duration-300 ${task.completed ? "line-through text-gray-500" : ""}`}>
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className={`text-sm mt-1 transition-all duration-300 ${task.completed ? "line-through text-gray-600" : "text-gray-400"}`}>
                                                    {task.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-600 mt-2">
                                                {new Date(task.created_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(task)}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            {deleteConfirm === task.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(task.id)}
                                                        className="px-2 py-1 text-xs text-red-400 hover:text-white hover:bg-red-500 rounded transition-all"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(task.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Info Banner */}
                <div className={`mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 ${mounted ? "animate-fade-in-up stagger-4" : "opacity-0"}`}>
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold mb-1">Want to sync across devices?</h3>
                            <p className="text-gray-400 text-sm">Create an account to save your tasks to the cloud and access them from anywhere.</p>
                        </div>
                        <Link
                            href="/signup"
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all whitespace-nowrap"
                        >
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
