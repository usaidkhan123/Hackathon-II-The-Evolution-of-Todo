"use client";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    message?: string;
}

const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3"
};

export function LoadingSpinner({ size = "md", className = "", message }: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div
                className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
                role="status"
                aria-label="Loading"
            />
            {message && (
                <p className="text-sm text-gray-500">{message}</p>
            )}
        </div>
    );
}
