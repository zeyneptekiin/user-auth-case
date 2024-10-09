import React from 'react';
import { FieldValues, UseFormRegister, RegisterOptions, Path } from 'react-hook-form';

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
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, options)}
                className={`w-full p-2 mb-1 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="text-left text-red-500 text-sm mb-3 pl-2">{error}</p>}
        </div>
    );
}
