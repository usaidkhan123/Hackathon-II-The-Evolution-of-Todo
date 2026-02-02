"use client";

import { createContext, useContext, ReactNode, useMemo, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

interface AuthContextType {
    user: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, isPending } = useSession();

    // Track if we've done initial load to prevent infinite re-renders
    const initialLoadDone = useRef(false);
    const lastUserId = useRef<string | null>(null);

    // Only update user reference when the user ID actually changes
    const user = useMemo(() => {
        const currentUser = session?.user || null;
        const currentUserId = currentUser?.id || null;

        // If user ID changed, update the reference
        if (currentUserId !== lastUserId.current) {
            lastUserId.current = currentUserId;
            return currentUser;
        }

        // If same user, return the existing user to maintain reference equality
        return currentUser;
    }, [session?.user?.id, session?.user]);

    // Mark initial load as done once we're not pending
    useEffect(() => {
        if (!isPending && !initialLoadDone.current) {
            initialLoadDone.current = true;
        }
    }, [isPending]);

    const value = useMemo(() => ({
        user,
        isLoading: isPending,
        isAuthenticated: !!user
    }), [user, isPending]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
