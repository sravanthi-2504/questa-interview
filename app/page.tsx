"use client";

import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import { interviewList } from "@/constants";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";


export default function HomePage() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const supabase = supabaseBrowser();

        async function loadSession() {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        }

        loadSession();
    }, []);

    return (
        <div>
            <Navbar />

            <div className="root-layout animate-fadeIn pb-20">
                {/* HERO SECTION */}
                <section className="card-cta relative overflow-hidden mt-10">
                    {/* LEFT TEXT */}
                    <div className="flex flex-col gap-5 max-w-xl z-10">
                        <h2 className="text-white text-4xl font-semibold leading-tight">
                            Get Interview Ready with AI-Powered Practice and Feedback
                        </h2>

                        <p className="text-gray-300 text-lg">
                            Practice on real interview questions & get instant feedback
                        </p>

                        {/* ⭐ LOGIN CHECK BUTTON ⭐ */}
                        {!session ? (
                            <Link href="/auth/sign-in">
                                <button className="btn-primary w-48 mt-3">
                                    Start an Interview
                                </button>
                            </Link>
                        ) : (
                            <Link href="/interview/setup">
                                <button className="btn-primary w-48 mt-3">
                                    Start an Interview
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* ROBOT IMAGE */}
                    <div className="relative w-[420px] h-[320px]">
                        <Image
                            src="/robot.webp"
                            alt="robot"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                </section>

                {/* YOUR INTERVIEWS */}
                <h2>Your Interviews</h2>

                <section className="interviews-section">
                    {interviewList.map((item) => (
                        <InterviewCard
                            key={item.id}
                            interviewId={item.id.toString()}
                            userId="1"
                            role={item.title}
                            type={item.level}
                            techstack={item.tech}
                            createdAt={item.date}
                        />
                    ))}
                </section>

                {/* TAKE AN INTERVIEW */}
                <h2>Take an interview</h2>

                <section className="interviews-section">
                    {interviewList.map((item) => (
                        <InterviewCard
                            key={item.id}
                            interviewId={item.id.toString()}
                            userId="1"
                            role={item.title}
                            type={item.level}
                            techstack={item.tech}
                            createdAt={item.date}
                        />
                    ))}
                </section>
            </div>
        </div>
    );
}
