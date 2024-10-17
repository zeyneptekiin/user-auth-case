import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Poppins } from 'next/font/google'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: "YCC",
    description: "Generated for YCC Case",
    icons: {
        icon: '/icon.png',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body
        className={`antialiased`}
      >
       <Navbar />
        {children}
      </body>
    </html>
  );
}
