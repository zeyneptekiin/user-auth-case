"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { login } from '@/services/login';

type OtpFormInputs = {
    otp: string;
};

export default function Verify() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const { register, handleSubmit, formState: { errors } } = useForm<OtpFormInputs>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onOtpSubmit: SubmitHandler<OtpFormInputs> = async (otpData) => {
        setErrorMessage(null);
        try {
            const response = await login({
                email: email as string,
                otp: otpData.otp,
            });

            if (response.success) {
                router.push('/');
            } else {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage('An unknown error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-lightest-blue">
            <div className="w-[400px] text-center bg-lighter-blue px-6 py-8 rounded-2xl shadow-xl">
                <h3 className="text-lg font-semibold mb-1">OTP Verification</h3>

                <p className="text-center text-sm text-darker-blue mb-4">
                    The OTP code has been sent to {email}.
                </p>

                <form onSubmit={handleSubmit(onOtpSubmit)}>
                    <input
                        type="text"
                        placeholder="Enter your OTP"
                        {...register('otp', { required: 'OTP is required!' })}
                        className={`w-full p-2 mb-1 border rounded ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errorMessage && <p className="text-left text-red-500 text-sm mb-3 pl-2">{errorMessage}!</p>}

                    <button type="submit" className="w-full bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
