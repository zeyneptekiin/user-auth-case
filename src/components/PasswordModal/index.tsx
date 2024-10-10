"use client";

import { useState, useEffect } from "react";

interface PasswordModalProps {
    password: string;
    touched: boolean;
}

export default function PasswordModal({ password, touched }: PasswordModalProps) {
    const [isOpen, setIsOpen] = useState(touched);

    useEffect(() => {
        setIsOpen(touched);
    }, [touched]);

    const passwordValue = password || "";

    const passwordStrength = {
        hasUpperCase: /[A-Z]/.test(passwordValue),
        hasLowerCase: /[a-z]/.test(passwordValue),
        hasNumber: /[0-9]/.test(passwordValue),
        isValidLength: passwordValue.length >= 8,
    };

    return (
        <>
            {isOpen && (
                <ul className="text-left text-sm mb-3 pl-2">
                    <li className={passwordStrength.isValidLength ? "text-green-500" : "text-red-500"}>
                        At least 8 characters
                    </li>
                    <li className={passwordStrength.hasUpperCase ? "text-green-500" : "text-red-500"}>
                        At least one uppercase letter
                    </li>
                    <li className={passwordStrength.hasLowerCase ? "text-green-500" : "text-red-500"}>
                        At least one lowercase letter
                    </li>
                    <li className={passwordStrength.hasNumber ? "text-green-500" : "text-red-500"}>
                        At least one number
                    </li>
                </ul>
            )}
        </>
    );
}
