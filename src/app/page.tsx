import Link from "next/link";

export default function Home() {
  return (
      <div className="flex items-center justify-center min-h-screen p-8 pb-20 bg-lightest-blue">
          <div className="w-[400px] text-center bg-lighter-blue px-2 py-32 rounded-2xl shadow-xl">
              <p className="text-lg font-semibold">Welcome!</p>
              <p className="mb-20">Please register or log in to continue.</p>
              <div className="flex flex-col items-center gap-4">
                  <Link href="/signup"
                        className="w-40 bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition text-center">
                      Sign Up
                  </Link>
                  <Link href="/login"
                        className="w-40 bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition text-center">
                      Log In
                  </Link>
              </div>
          </div>
      </div>
  );
}
