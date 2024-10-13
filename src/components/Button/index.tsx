import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
}

export default function Button({ children }: ButtonProps) {
    return (
        <button type="submit" className="w-full bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition">
            {children}
        </button>
    );
}