"use client";

import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { getCookie } from 'cookies-next';
import { getUserData } from '@/services/getUserData';

export default function Home() {
    // Get userName from Zustand store and function to update it
    const { userName, setUserName } = useAuthStore();

    // Local states
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

    // Memoized token validation function
    const validateToken = useCallback(async (token: string) => {
        const result = await getUserData(token);

        if (result.success) {
            setIsTokenValid(true);
            // If result.success is true, do nothing with userName
        } else {
            console.error(result.message);
            setIsTokenValid(false);
            setUserName(''); // Clear userName when the token is invalid
        }
    }, [setUserName]);

    // Retrieve token from cookie and validate it
    useEffect(() => {
        const token = getCookie('authToken') as string | undefined;

        if (token) {
            setAuthToken(token);

            (async () => {
                try {
                    await validateToken(token);
                } catch (error) {
                    console.error("Error validating token:", error);
                }
            })();
        } else {
            setIsTokenValid(false);
        }
    }, [validateToken]);

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-lightest-blue">
            <div className="w-[400px] text-center bg-lighter-blue px-2 py-32 rounded-2xl shadow-xl">
                {authToken && isTokenValid === true ? (
                    // Render this block if the user is logged in and token is valid
                    <>
                        <p className="text-lg font-semibold text-black-blue">Welcome {userName}!</p>
                        <p className="text-sm text-black-blue">Your login has been successfully completed!</p>
                    </>
                ) : isTokenValid === false ? (
                    // Render this block if the token is invalid
                    <>
                        <p className="text-lg font-semibold text-red-600">Session expired!</p>
                        <p className="mb-20">Please log in again to continue.</p>
                        <Link href="/login"
                              className="w-40 bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition text-center">
                            Log In
                        </Link>
                    </>
                ) : (
                    // Render this block if the user is not logged in or validation is pending
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
