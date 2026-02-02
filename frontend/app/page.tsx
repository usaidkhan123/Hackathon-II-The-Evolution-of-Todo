"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />
            </div>

            {/* Navigation */}
            <nav className={`relative z-10 px-6 py-4 ${mounted ? "animate-fade-in-down" : "opacity-0"}`}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">TaskFlow</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            href="/todo"
                            className="px-4 py-2.5 text-sm font-medium text-white bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                        >
                            Todo
                        </Link>
                        <Link
                            href="/login"
                            className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-20 pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 ${mounted ? "animate-fade-in-up" : "opacity-0"}`}>
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sm text-gray-400">Now with real-time sync</span>
                        </div>

                        {/* Headline */}
                        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${mounted ? "animate-fade-in-up stagger-1" : "opacity-0"}`}>
                            <span className="text-white">Organize your life with </span>
                            <span className="gradient-text">TaskFlow</span>
                        </h1>

                        {/* Subheadline */}
                        <p className={`text-xl text-gray-400 max-w-2xl mx-auto mb-10 ${mounted ? "animate-fade-in-up stagger-2" : "opacity-0"}`}>
                            The beautifully designed task manager that helps you stay focused,
                            organized, and accomplish more every day.
                        </p>

                        {/* CTA Buttons */}
                        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 ${mounted ? "animate-fade-in-up stagger-3" : "opacity-0"}`}>
                            <Link
                                href="/todo"
                                className="group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Try it now
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                            <Link
                                href="/signup"
                                className="px-8 py-4 text-lg font-semibold text-gray-300 border border-gray-700 rounded-xl hover:bg-white/5 hover:border-gray-600 transition-all duration-300"
                            >
                                Create an account
                            </Link>
                        </div>

                        {/* Feature Cards */}
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${mounted ? "animate-fade-in-up stagger-4" : "opacity-0"}`}>
                            <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 card-hover">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                                <p className="text-gray-400 text-sm">Instant updates with optimistic UI. Your tasks sync in real-time.</p>
                            </div>

                            <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 card-hover">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Secure by Default</h3>
                                <p className="text-gray-400 text-sm">Your data is encrypted and protected with industry-standard security.</p>
                            </div>

                            <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 card-hover">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">Smart & Simple</h3>
                                <p className="text-gray-400 text-sm">Intuitive design that gets out of your way and lets you focus.</p>
                            </div>
                        </div>
                    </div>

                    {/* App Preview */}
                    <div className={`mt-20 relative ${mounted ? "animate-fade-in-up stagger-5" : "opacity-0"}`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10 pointer-events-none" />
                        <div className="relative mx-auto max-w-4xl">
                            <div className="rounded-2xl border border-white/10 bg-[#12121a] p-4 shadow-2xl">
                                {/* Window Controls */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <div className="flex-1 text-center text-sm text-gray-500">TaskFlow</div>
                                </div>
                                {/* Mock Task List */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-6 h-6 rounded-md border-2 border-indigo-500 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-400 line-through">Design new landing page</span>
                                        <span className="ml-auto px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Done</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-6 h-6 rounded-md border-2 border-gray-600" />
                                        <span className="text-white">Review pull requests</span>
                                        <span className="ml-auto px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">In Progress</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-6 h-6 rounded-md border-2 border-gray-600" />
                                        <span className="text-white">Prepare presentation for Monday</span>
                                        <span className="ml-auto px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-400">Todo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                    <p>&copy; 2026 TaskFlow. Built with Next.js and FastAPI.</p>
                </div>
            </footer>
        </div>
    );
}
