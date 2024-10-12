"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, Suspense } from 'react';
import { login } from '@/services/login';
import OtpInput from 'react-otp-input';

type OtpFormInputs = {
    otp: string;
};

function OtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const { handleSubmit, formState: { errors } } = useForm<OtpFormInputs>();
    const [otp, setOtp] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onOtpSubmit: SubmitHandler<OtpFormInputs> = async () => {
        setErrorMessage(null);
        try {
            const response = await login({
                email: email as string,
                otp: otp,
            });

            if (response.success) {
                router.push('/');
            } else {
                setErrorMessage(response.message);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setErrorMessage(`An unknown error occurred: ${errorMessage}`);
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
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => <input {...props} />}
                        containerStyle="mb-4"
                        inputStyle={`mx-auto !w-10 h-10 border rounded ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
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

export default function Verify() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpForm />
        </Suspense>
    );
}
