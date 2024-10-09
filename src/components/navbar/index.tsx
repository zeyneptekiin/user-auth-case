import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="bg-primary-blue p-4 text-white">
            <div className="max-w-7xl mx-auto flex justify-between">
                <Link href="/" className="hover:underline font-semibold">Home</Link>
                <div className="flex gap-4">
                    <Link href="/signup" className="hover:underline font-semibold">Sign Up</Link>
                    <Link href="/login" className="hover:underline font-semibold">Log In</Link>
                </div>
            </div>
        </nav>
    );
};