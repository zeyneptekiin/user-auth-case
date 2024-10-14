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
    const { setEmail, setPassword } = useAuthStore();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setErrorMessage(null);
        setEmail(data.email);
        setPassword(data.password);

        try {
            const response = await verify({
                email: data.email,
                password: data.password,
            });

            if (response.success) {
                router.push(`/login/verify`);
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
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
                <h2 className="text-lg font-semibold mb-4">Log In</h2>
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

                    {errorMessage && <p className="text-red-500 mb-4 text-left text-sm pl-2">{errorMessage}!</p>}

                    <Button>
                        Log In
                    </Button>
                </form>
                <p className="mt-4">
                    Don&#39;t have an account? <Link href="/signup" className="font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
