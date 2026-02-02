"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="min-h-[44px] min-w-[44px] px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
            Logout
        </button>
    );
}
