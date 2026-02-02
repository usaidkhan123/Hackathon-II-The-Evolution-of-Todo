const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Custom API error with status code and user-friendly message
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public userMessage: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Get user-friendly error message based on status code
 */
function getUserFriendlyMessage(status: number, defaultMessage?: string): string {
    switch (status) {
        case 400:
            return defaultMessage || "Invalid request. Please check your input.";
        case 401:
            return "Your session has expired. Please sign in again.";
        case 403:
            return "You don't have permission to perform this action.";
        case 404:
            return "The requested item was not found. It may have been deleted.";
        case 422:
            return defaultMessage || "Invalid data provided. Please check your input.";
        case 429:
            return "Too many requests. Please wait a moment and try again.";
        case 500:
        case 502:
        case 503:
            return "Something went wrong on our end. Please try again later.";
        default:
            return defaultMessage || "An unexpected error occurred. Please try again.";
    }
}

/**
 * Get JWT token from Better Auth using the jwtClient plugin
 */
async function getToken(): Promise<string | null> {
    try {
        // Import dynamically to avoid SSR issues
        const { authClient } = await import("@/lib/auth-client");

        // Use the token() method from jwtClient plugin
        console.log("[DEBUG] Calling authClient.token()...");
        const { data, error } = await authClient.token();
        console.log("[DEBUG] Token response:", { data, error });

        if (error || !data?.token) {
            console.error("Failed to get token:", error);
            return null;
        }

        console.log("[DEBUG] Got token:", data.token.substring(0, 50) + "...");
        return data.token;
    } catch (error) {
        console.error("Failed to get token:", error);
        return null;
    }
}

/**
 * Fetch with authentication and improved error handling
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = await getToken();

    if (!token) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw new ApiError("Not authenticated", 401, "Please sign in to continue.");
    }

    let response: Response;
    try {
        response = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
    } catch (error) {
        // Network error - API unreachable
        throw new ApiError(
            "Network error",
            0,
            "Unable to connect. Please check your internet connection and try again."
        );
    }

    if (response.status === 401) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        throw new ApiError(
            "Session expired",
            401,
            "Your session has expired. Please sign in again."
        );
    }

    if (!response.ok) {
        let errorDetail: string | undefined;
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorData.message || errorData.error;
        } catch {
            try {
                errorDetail = await response.text();
            } catch {
                errorDetail = undefined;
            }
        }

        throw new ApiError(
            errorDetail || `Request failed with status ${response.status}`,
            response.status,
            getUserFriendlyMessage(response.status, errorDetail)
        );
    }

    return response;
}

// Task interfaces
export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface TaskCreate {
    title: string;
    description?: string;
}

export interface TaskUpdate {
    title?: string;
    description?: string;
    completed?: boolean;
}

// Task API
export const taskApi = {
    /**
     * Get all tasks for the authenticated user
     */
    list: async (): Promise<Task[]> => {
        const response = await fetchWithAuth("/api/tasks");
        return response.json();
    },

    /**
     * Create a new task
     */
    create: async (data: TaskCreate): Promise<Task> => {
        const response = await fetchWithAuth("/api/tasks", {
            method: "POST",
            body: JSON.stringify(data)
        });
        return response.json();
    },

    /**
     * Update an existing task
     */
    update: async (id: number, data: TaskUpdate): Promise<Task> => {
        const response = await fetchWithAuth(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        });
        return response.json();
    },

    /**
     * Delete a task
     */
    delete: async (id: number): Promise<void> => {
        await fetchWithAuth(`/api/tasks/${id}`, {
            method: "DELETE"
        });
    },

    /**
     * Toggle task completion status
     */
    toggleComplete: async (id: number): Promise<Task> => {
        const response = await fetchWithAuth(`/api/tasks/${id}/complete`, {
            method: "PATCH"
        });
        return response.json();
    }
};
