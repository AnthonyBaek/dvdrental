import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DVD Rental System",
  description: "DVD Rental Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`w-full m-0 p-0 bg-gray-900`}>
        <main className="w-full m-0 p-0">
          {children}
        </main>
      </body>
    </html>
  );
}
