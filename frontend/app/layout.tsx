import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Earth Arcade | Official Fan Site",
    description: "The Multiverse Action Adventure Variety Show Archive.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${inter.className} antialiased min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden`}
            >
                {children}
                <Toaster richColors position="bottom-right" theme="dark" />
            </body>
        </html>
    );
}
