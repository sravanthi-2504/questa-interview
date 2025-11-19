"use client";

import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import { interviewList } from "@/constants";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { interviewTemplates } from "@/data/interviewTemplates";



export default function HomePage() {
    const [session, setSession] = useState(null);
    const [userInterviews, setUserInterviews] = useState([]);

    useEffect(() => {
        const supabase = supabaseBrowser();

        async function loadSession() {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        }

        async function loadInterviews() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) return;

            const { data } = await supabase
                .from("interviews")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            setUserInterviews(data || []);
        }

        loadSession();
        loadInterviews();
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
                            src="/robot.png"
                            alt="robot"
                            fill
                            priority
                            className="object-contain"
                        />
                    </div>
                </section>

                {/* my INTERVIEWS */}
                {/* my INTERVIEWS */}
                <h2>My Interviews</h2>

                <section className="interviews-section">
                    {userInterviews.length === 0 && (
                        <p className="text-gray-400">You have no interviews yet.</p>
                    )}

                    {userInterviews.map((item) => (
                        <InterviewCard
                            key={item.id}
                            interviewId={item.id}
                            userId={item.user_id}
                            role={item.role}
                            type={item.type}
                            techstack={item.techstack}
                            company={item.company}
                            createdAt={item.created_at}
                            feedback={{
                                totalScore: item.score,
                                finalAssessment: item.feedback,
                            }}
                        />
                    ))}
                </section>


                {/* TAKE AN INTERVIEW */}
                <h2>Take an interview</h2>

                <section className="interviews-section">
                    {interviewTemplates.map((item) => (
                        <InterviewCard
                            key={item.company}
                            interviewId={item.company}
                            userId="1"
                            role={item.role}
                            type={item.type}
                            techstack={item.techstack}
                            company={item.company}
                            logo={item.logo}
                            createdAt={item.date}
                        />
                    ))}
                </section>

            </div>
        </div>
    );
}
