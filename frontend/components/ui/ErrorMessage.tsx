"use client";

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
    className?: string;
}

export function ErrorMessage({ message, onRetry, onDismiss, className = "" }: ErrorMessageProps) {
    return (
        <div
            className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <svg
                    className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clipRule="evenodd"
                    />
                </svg>
                <div className="flex-1">
                    <p className="text-sm text-red-700">{message}</p>
                    {(onRetry || onDismiss) && (
                        <div className="mt-3 flex gap-2">
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="min-h-[44px] px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Try again
                                </button>
                            )}
                            {onDismiss && (
                                <button
                                    onClick={onDismiss}
                                    className="min-h-[44px] px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Dismiss
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
