"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { clearAuth } = useAuthStore();
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        const token = getCookie('authToken') as string | null;
        setAuthToken(token);
    }, []);

    // Handle logout functionality: clear the auth data and reload the page
    const handleLogout = () => {
        clearAuth(); // Clear authentication data from Zustand store
        setAuthToken(null); // Reset auth token in local state
        window.location.reload(); // Reload the page to apply logout changes
    };

    return (
        <nav className="bg-primary-blue p-4 text-white h-[60px] absolute w-screen">
            <div className="max-w-7xl mx-auto flex justify-between">
                <Link
                    href="/"
                    className={`hover:underline font-semibold ${
                        pathname === "/" ? "text-black-blue" : "text-white"
                    }`}
                >
                    Home
                </Link>

                {/* Conditional rendering based on the presence of the auth token */}
                {authToken ? (
                    // If user is logged in, show the Log-Out button
                    <div className="flex gap-4">
                        <button onClick={handleLogout} className="hover:underline font-semibold text-white">
                            Log Out
                        </button>
                    </div>
                ) : (
                    // If user is not logged in, show Sign Up and Log In links
                    <div className="flex gap-4">
                        <Link
                            href="/signup"
                            className={`hover:underline font-semibold ${
                                pathname === "/signup" ? "text-black-blue" : "text-white"
                            }`}
                        >
                            Sign Up
                        </Link>

                        <Link
                            href="/login"
                            className={`hover:underline font-semibold ${
                                pathname === "/login" ? "text-black-blue" : "text-white"
                            }`}
                        >
                            Log In
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
