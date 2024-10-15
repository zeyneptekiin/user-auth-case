"use client";

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, Suspense } from 'react';
import { login } from '@/services/login';
import OtpInput from 'react-otp-input';
import Button from "@/components/Button";
import { useAuthStore } from '@/store/authStore';

type OtpFormInputs = {
    otp: string;
};

function OtpForm() {
    const { email, password, setPassword } = useAuthStore();
    const { handleSubmit, formState: { errors } } = useForm<OtpFormInputs>();
    const [otp, setOtp] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onOtpSubmit: SubmitHandler<OtpFormInputs> = async () => {
        setErrorMessage(null);

        const response = await login({
            email,
            password,
            otp,
        });

        if (response.token) {
            setPassword('');
            window.location.href = '/';
        } else {
            setErrorMessage(response.message);
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
                        onChange={(value) => {
                            if (/^\d*$/.test(value)) {
                                setOtp(value);
                            }
                        }}
                        numInputs={6}
                        renderInput={(props) => (
                            <input
                                {...props}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                className={`mx-auto !w-10 h-10 border rounded text-black-blue ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
                                onKeyDown={(e) => {
                                    if (e.key.match(/[^0-9]/)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        )}
                        containerStyle="mb-4"
                    />
                    {errorMessage && <p className="text-left text-red-500 text-sm mb-3 pl-2">{errorMessage}!</p>}

                    <Button>
                        Submit
                    </Button>
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
