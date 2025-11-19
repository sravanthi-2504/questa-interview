"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItems = [
        { label: "Home", href: "/" },
        { label: "Features", href: "/#features" },
        { label: "Pricing", href: "/#pricing" },
        { label: "About", href: "/#about" },
    ];

    return (
        <nav className="w-full border-b border-white/10 backdrop-blur-md bg-black/20 fixed top-0 left-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="text-xl font-semibold">
                    Questa<span className="text-indigo-400">.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm hover:text-indigo-400 transition ${
                                pathname === item.href ? "text-indigo-400" : "text-gray-300"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/sign-in"   // ✅ FIXED
                        className="text-sm text-gray-200 hover:text-indigo-400 transition"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"   // ✅ FIXED
                        className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 transition rounded-md text-white"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Open Menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {open && (
                <div className="md:hidden bg-black/40 backdrop-blur-md border-t border-white/10 px-4 py-4 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="text-gray-200 text-sm hover:text-indigo-400 transition"
                        >
                            {item.label}
                        </Link>
                    ))}

                    <Link
                        href="/sign-in"   // ✅ FIXED
                        onClick={() => setOpen(false)}
                        className="text-gray-200 text-sm hover:text-indigo-400 transition"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"   // ✅ FIXED
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 mt-1 text-sm bg-indigo-500 hover:bg-indigo-600 rounded-md text-white text-center"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </nav>
    );
}
