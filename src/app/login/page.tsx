"use client";

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';
import Input from '../../components/Input';
import { verify } from '@/services/verify';
import Button from "@/components/Button";
import { useAuthStore } from '@/store/authStore';

type LoginFormInputs = {
    email: string;
    password: string;
};

export default function Login() {
    // Zustand global store to manage email and password
    const { setEmail, setPassword } = useAuthStore();

    // react-hook-form setup for handling form submission and validation
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    // Local state to manage error messages
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();

    // Handle form submission
    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setErrorMessage(null);

        try {
            // Call the verify service to authenticate the user
            const response = await verify({
                email: data.email,
                password: data.password,
            });

            if (response.success) {
                // If authentication is successful, store the user's email and password
                setEmail(data.email);
                setPassword(data.password);

                router.push(`/login/verify`);
            } else {
                // Display error message if authentication fails
                setErrorMessage(response.message);
            }
        } catch (error) {
            // Handle unexpected errors
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-lightest-blue">
            <div className="w-[400px] text-center bg-lighter-blue px-6 py-8 rounded-2xl shadow-xl">
                <h2 className="text-lg font-semibold mb-4 text-black-blue">Log In</h2>

                {/* Form for login */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="email"
                        placeholder="Email"
                        register={register}
                        name="email"
                        options={{ required: 'Email is required!' }}
                        error={errors.email?.message || ''}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        register={register}
                        name="password"
                        options={{ required: 'Password is required!' }}
                        error={errors.password?.message || ''}
                    />

                    {/* Error message if login fails */}
                    {errorMessage && <p className="text-red-500 mb-4 text-left text-sm pl-2">{errorMessage}!</p>}

                    <Button>
                        Log In
                    </Button>
                </form>
                <p className="mt-4 text-black-blue">
                    Don&#39;t have an account? <Link href="/signup" className="font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
