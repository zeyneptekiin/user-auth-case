"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import Input from '../../components/input';

interface LoginFormInputs {
    email: string;
    password: string;
}

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        console.log('Logged In:', data);
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
                    <button type="submit" className="w-full bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition">
                        Log In
                    </button>
                </form>
                <p className="mt-4">
                    Don&#39;t have an account? <Link href="/signup" className="font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
