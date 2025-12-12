"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function InterviewGeneratorPage() {
    const params = useSearchParams();

    const role = params.get("role") ?? "";
    const type = params.get("type") ?? "";
    const techstack = params.get("techstack") ?? "";
    const easy = Number(params.get("easy") ?? "0");
    const medium = Number(params.get("medium") ?? "0");
    const hard = Number(params.get("hard") ?? "0");

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    type,
                    techstack,
                    easy,
                    medium,
                    hard,
                }),
            });

            const data = await res.json();
            setQuestions(Array.isArray(data) ? data : []);
            setLoading(false);
        }

        load();
    }, [role, type, techstack, easy, medium, hard]);

    return (
        <div className="min-h-screen px-6 py-10 text-white">
            <h1 className="text-3xl font-bold mb-6">Generated Questions</h1>

            {loading ? (
                <p className="text-blue-400 text-lg">Generating questions...</p>
            ) : (
                <div className="space-y-4">
                    {questions.map((q, i) => (
                        <div key={i} className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
                            <p className="text-lg font-semibold">{i + 1}. {q.question}</p>
                            <p className="text-sm text-gray-400">Difficulty: {q.difficulty}</p>
                        </div>
                    ))}

                    {questions.length === 0 && (
                        <p className="text-red-500">No questions generated.</p>
                    )}
                </div>
            )}
        </div>
    );
}
