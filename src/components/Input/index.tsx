import React, {useState} from 'react';
import { FieldValues, UseFormRegister, RegisterOptions, Path } from 'react-hook-form';
import Image from 'next/image';
import eyeOpen from '../../public/input/eye-open.png'
import eyeClose from '../../public/input/eye-close.png'

interface InputProps<T extends FieldValues> {
    type: string;
    placeholder: string;
    register: UseFormRegister<T>;
    name: Path<T>;
    options: RegisterOptions<T>;
    error?: string;
}

export default function Input<T extends FieldValues>({
                                                         type,
                                                         placeholder,
                                                         register,
                                                         name,
                                                         options,
                                                         error,
                                                     }: InputProps<T>) {
    // Local state to manage password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Toggles password visibility in input field
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            {/* Input field with dynamic type (for password visibility toggle) */}
            <input
                type={showPassword && type === "password" ? "text" : type}
                placeholder={placeholder}
                autoComplete={type === "email" ? "email" : undefined}
                {...register(name, options)}
                className={`w-full p-2 mb-1 border rounded text-black-blue ${error ? 'border-red-500' : 'border-gray-300'}`}
            />

            {/* Show/Hide password toggle eye icon for password fields */}
            {type === "password" && (
                <span onClick={toggleShowPassword} className="absolute right-2 top-3 cursor-pointer">
                    <Image
                        src={showPassword ? eyeOpen : eyeClose}
                        alt="Toggle Password Visibility"
                        width={20}
                        height={20}
                        className="w-5 h-5 opacity-50"
                        key={showPassword ? "eye-open" : "eye-close"}
                    />
                </span>
            )}

            {/* Error message if input validation fails */}
            {error && <p className="text-left text-red-500 text-sm mb-3 pl-2">{error}</p>}
        </div>
    );
}
