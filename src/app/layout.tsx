import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";



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
    <html lang="en">
      <body
        className={`antialiased`}
      >
       <Navbar />
        {children}
      </body>
    </html>
  );
}
