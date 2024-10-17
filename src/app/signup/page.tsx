"use client";

import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import Input from '../../components/Input';
import { useState } from 'react';
import { registerUser } from '@/services/register';
import { verify } from '@/services/verify';
import PasswordModal from '../../components/PasswordModal';
import Button from "@/components/Button";
import { useAuthStore } from '@/store/authStore';

type SignUpFormInputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignUp() {
    // Zustand global store for managing user state
    const { setUserName, setEmail, setPassword } = useAuthStore();

    // react-hook-form setup for form handling and validation
    const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormInputs>();

    // Local states for managing messages and form feedback
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const router = useRouter();

    // Handle form submission
    const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            // Call registerUser service to register the user
            const result = await registerUser({
                email: data.email,
                password: data.password,
                userName: data.username,
            });

            if (result.success) {
                // If registration is successful, display success message and show popup
                setSuccessMessage('User registered successfully.');
                setShowPopup(true);

                // Attempt to log in the user automatically
                const loginResponse = await verify({
                    email: data.email,
                    password: data.password,
                });

                if (loginResponse.success) {
                    // If login is successful, set user info in the store and redirect to OTP page
                    setUserName(data.username);
                    setEmail(data.email);
                    setPassword(data.password);
                    setTimeout(() => {
                        router.push(`/login/verify`);
                    }, 5000);
                } else {
                    // Display error if login fails
                    setErrorMessage('Login after registration failed.');
                }

            } else {
                // Handle registration failure
                setErrorMessage(result.message || 'Failed to register user.');
            }
        } catch {
            // Catch unknown errors and display message
            setErrorMessage('An unknown error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-lightest-blue">
            <div className="w-[400px] text-center bg-lighter-blue px-6 py-8 rounded-2xl shadow-xl">
                <h2 className="text-lg font-semibold mb-1 text-black-blue">Sign Up</h2>
                <h3 className="text-sm text-darker-blue mb-4">Create a new account</h3>

                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                {/* Success message and popup on successful registration */}
                {successMessage && showPopup && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="bg-white p-4 rounded shadow-md text-center">
                            <p className="text-green-500 mb-4">{successMessage}</p>
                            <p className="text-black-blue">You will be redirected to OTP page in 5 seconds...</p>
                        </div>
                    </div>
                )}

                {/* Form for sign-up */}
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

                    {/* Confirm password field with matching validation */}
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
                    <Button>
                        Sign Up
                    </Button>
                </form>
                <p className="mt-4 text-black-blue">
                    Already have an account? <Link href="/login" className="font-semibold">Log In</Link>
                </p>
            </div>
        </div>
    );
}
