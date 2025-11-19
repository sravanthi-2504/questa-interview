"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function InterviewPage() {
    const params = useSearchParams();

    // Read all URL values
    const role = params.get("role") ?? "General";
    const type = params.get("type") ?? "Technical";
    const tech = params.get("techstack") ?? "";
    const amount = Number(params.get("amount") ?? "5");

    const easy = Number(params.get("easy") ?? "0");
    const medium = Number(params.get("medium") ?? "0");
    const hard = Number(params.get("hard") ?? "0");

    const techArray = tech ? tech.split(",") : [];

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    /* ---------------------------------------------
       Load Supabase User
    --------------------------------------------- */
    useEffect(() => {
        async function loadUser() {
            const supabase = supabaseBrowser();
            const { data } = await supabase.auth.getUser();
            setUser(data?.user ?? null);
        }
        loadUser();
    }, []);

    /* ---------------------------------------------
       Load Questions From API
    --------------------------------------------- */
    useEffect(() => {
        if (!user) return; // Wait for Supabase user

        async function loadQuestions() {
            setLoading(true);

            try {
                const res = await fetch("/api/interview", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        role,
                        type,
                        techstack: techArray,
                        amount,
                        easy,
                        medium,
                        hard,
                        user_id: user.id,
                        company: "pinterest",
                    }),
                });

                const data = await res.json();

                if (Array.isArray(data)) {
                    setQuestions(data);
                } else {
                    console.error("❌ API did not return array:", data);
                    setQuestions([]);
                }

            } catch (err) {
                console.error("❌ Fetch Error:", err);
                setQuestions([]);
            }

            setLoading(false);
        }

        loadQuestions();
    }, [
        user,
        role,
        type,
        tech,
        amount,
        easy,
        medium,
        hard,
    ]); // dependency array is now always stable

    /* ---------------------------------------------
       Loading State
    --------------------------------------------- */
    if (loading) {
        return (
            <p className="p-6 text-lg">
                Generating interview questions...
            </p>
        );
    }

    /* ---------------------------------------------
       UI Render
    --------------------------------------------- */
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                AI Interview Questions
            </h1>

            {questions.length === 0 && (
                <p className="text-red-400 text-lg">
                    Failed to load questions.
                </p>
            )}

            {questions.map((q, idx) => (
                <div
                    key={idx}
                    className="p-4 mb-4 rounded bg-gray-900 border border-gray-700"
                >
                    <p className="text-lg font-semibold">
                        Q{idx + 1}: {q.question}
                    </p>
                    <span className="text-indigo-400 text-sm">
                        {q.difficulty}
                    </span>
                </div>
            ))}
        </div>
    );
}
