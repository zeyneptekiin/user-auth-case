"use client";

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

export default function Home() {
    // Get the username from Zustand store
    const { userName } = useAuthStore();

    // Local state to store the authToken
    const [authToken, setAuthToken] = useState<string | null>(null);

    // useEffect to retrieve the authToken from the browser cookie
    useEffect(() => {
        const token = getCookie('authToken') as string | undefined;
        if (token) {
            setAuthToken(token);
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-lightest-blue">
            <div className="w-[400px] text-center bg-lighter-blue px-2 py-32 rounded-2xl shadow-xl">
                { authToken ? (
                    // Render this block if the user is logged in (authToken exists)
                    <>
                        <p className="text-lg font-semibold text-black-blue">Welcome {userName}!</p>
                        <p className="text-sm text-black-blue">Your login has been successfully completed!</p>
                    </>
                ) : (
                    // Render this block if the user is not logged in (no authToken)
                    <>
                        <p className="text-lg font-semibold">Welcome!</p>
                        <p className="mb-20">Please register or log in to continue.</p>
                        <div className="flex flex-col items-center gap-4">
                            <Link href="/signup"
                                  className="w-40 bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition text-center">
                                Sign Up
                            </Link>
                            <Link href="/login"
                                  className="w-40 bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition text-center">
                                Log In
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
