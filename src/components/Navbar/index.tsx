"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-primary-blue p-4 text-white">
            <div className="max-w-7xl mx-auto flex justify-between">
                <Link
                    href="/"
                    className={`hover:underline font-semibold ${
                        pathname === "/" ? "text-black-blue" : "text-white"
                    }`}
                >
                    Home
                </Link>

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
            </div>
        </nav>
    );
}
