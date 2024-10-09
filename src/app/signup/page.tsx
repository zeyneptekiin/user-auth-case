"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import Input from '../../components/input';

type SignUpFormInputs = {
    username: string;
    email: string;
    password: string;
};

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();

    const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
        console.log('Signed Up:', data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-lightest-blue">
            <div className="w-[400px] text-center bg-lighter-blue px-6 py-8 rounded-2xl shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="text"
                        placeholder="Username"
                        register={register}
                        name="username"
                        options={{ required: 'Username is required!' }}
                        error={errors.username?.message}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        register={register}
                        name="email"
                        options={{ required: 'Email is required!' }}
                        error={errors.email?.message}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        register={register}
                        name="password"
                        options={{ required: 'Password is required!' }}
                        error={errors.password?.message}
                    />
                    <button type="submit" className="w-full bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition">
                        Sign Up
                    </button>
                </form>
                <p className="mt-4">
                    Already have an account? <Link href="/login" className="font-semibold">Log In</Link>
                </p>
            </div>
        </div>
    );
}
