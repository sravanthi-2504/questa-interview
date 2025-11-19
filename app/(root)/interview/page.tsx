"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function InterviewPage() {
    const params = useSearchParams();
    const role = params.get("role");
    const type = params.get("type");
    const tech = params.get("techstack");

    const techArray = tech ? tech.split(",") : [];

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadQuestions() {
            try {
                const formData = {
                    role,
                    type,
                    techstack: techArray,
                    amount: 5,
                };

                const res = await fetch("/api/generate-questions", {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: { "Content-Type": "application/json" }
                });

                const data = await res.json();

                const safeQuestions = Array.isArray(data) ? data : [];

                setQuestions(safeQuestions);

                if (!Array.isArray(data)) {
                    console.error("❌ API did not return an array:", data);
                }

            } catch (err) {
                console.error("❌ Fetch failed:", err);
                setQuestions([]);
            }

            setLoading(false);
        }

        loadQuestions();
    }, []);

    if (loading) {
        return <p className="p-6 text-lg">Generating interview questions...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">AI Interview Questions</h1>

            {questions.length === 0 && (
                <p className="text-red-400 text-lg">Failed to load questions.</p>
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
