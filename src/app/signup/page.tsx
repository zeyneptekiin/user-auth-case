"use client";

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import Input from '../../components/Input';
import { useState } from 'react';
import { registerUser } from '@/services/register';
import PasswordModal from '../../components/PasswordModal';

type SignUpFormInputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormInputs>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const router = useRouter();

    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const result = await registerUser({
                email: data.email,
                password: data.password,
                userName: data.username,
            });

            if (result.success) {
                setSuccessMessage('User registered successfully.');
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    router.push('/login');
                }, 5000);
            } else {
                setErrorMessage(result.message || 'Failed to register user.');
            }
        } catch {
            setErrorMessage('An unknown error occurred. Please try again.' );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-lightest-blue">
            <div className="w-[400px] text-center bg-lighter-blue px-6 py-8 rounded-2xl shadow-xl">
                <h2 className="text-lg font-semibold mb-1 text-black-blue">Sign Up</h2>
                <h3 className="text-sm text-darker-blue mb-4">Create a new account</h3>

                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                {successMessage && showPopup && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded shadow-md text-center">
                            <p className="text-green-500 mb-4">{successMessage}</p>
                            <p>You will be redirected to login page in 5 seconds...</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="text"
                        placeholder="Username"
                        register={register}
                        name="username"
                        options={{required: 'Username is required!'}}
                        error={errors.username?.message}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        register={register}
                        name="email"
                        options={{required: 'Email is required!'}}
                        error={errors.email?.message}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        register={register}
                        name="password"
                        options={{
                            required: 'Password is required!',
                            onChange: () => setPasswordTouched(true),
                        }}
                        error={errors.password?.message}
                    />

                    <PasswordModal password={watch('password')} touched={passwordTouched}/>

                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        register={register}
                        name="confirmPassword"
                        options={{
                            required: 'Confirm Password is required!',
                            validate: (value: string) =>
                                value === watch('password') || 'Passwords do not match!',
                        }}
                        error={errors.confirmPassword?.message}
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
