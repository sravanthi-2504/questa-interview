"use client";

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="min-h-screen text-white">

            {/* NAVBAR */}
            <nav className="flex justify-between items-center px-10 py-6">
                <div className="flex items-center gap-3">
                    <Image src="/logo.webp" alt="Questa Logo" width={40} height={40} />
                    <h1 className="text-2xl font-bold">Questa</h1>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/sign-in" className="text-gray-300 hover:text-white">
                        Sign In
                    </Link>
                    <Link
                        href="/sign-up"
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
                    >
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="px-10 md:px-20 lg:px-32 mt-10">
                <div className="bg-gradient-to-r from-[#0F0F28] to-[#111133] rounded-3xl p-10 md:flex items-center justify-between">

                    {/* TEXT */}
                    <div className="md:w-1/2">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Get Interview Ready with AI-Powered Practice and Feedback
                        </h1>

                        <p className="mt-4 text-gray-300 text-lg">
                            Practice with real interview questions & get instant feedback.
                        </p>

                        <div className="mt-8 flex flex-col md:flex-row gap-4">

                            <Link href="/generate-interview">
                                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold">
                                    Generate Interview Questions
                                </button>
                            </Link>

                            <Link href="/live-interview/setup">
                                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold">
                                    Start Live Interview
                                </button>
                            </Link>

                        </div>
                    </div>

                    {/* IMAGE */}
                    <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
                        <Image
                            src="/robot.png"
                            alt="Robot Interview Assistant"
                            width={400}
                            height={400}
                            className="drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}
