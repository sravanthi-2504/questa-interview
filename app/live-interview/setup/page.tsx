"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "MERN Developer",
    "Node.js Developer",
    "React Developer",
    "Next.js Developer",
    "Java Developer",
    "Python Developer",
    "ML Engineer",
    "Data Scientist",
    "Data Analyst",
    "Cloud Engineer",
    "DevOps Engineer",
    "Mobile App Developer",
    "Android Developer",
    "iOS Developer",
    "Cybersecurity Engineer",
    "UI/UX Engineer",
    "Product Engineer",
];

const TYPES = [
    "Coding",
    "Technical",
    "HR",
    "Behavioral",
    "Managerial",
    "Aptitude",
];

const DIFFICULTIES = ["easy", "medium", "hard", "mixed"];

const TECHSTACK_OPTIONS = [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "Firebase",
    "TypeScript",
    "JavaScript",
    "Java",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
];

export default function LiveInterviewSetup() {
    const router = useRouter();

    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [questions, setQuestions] = useState(5);
    const [techstack, setTechstack] = useState<string[]>([]);
    const [customTech, setCustomTech] = useState("");

    async function startInterview() {
        if (!role || !type || !difficulty) {
            alert("Please fill all required fields.");
            return;
        }

        const supabase = supabaseBrowser();
        const {
            data: { session },
        } = await supabase.auth.getSession();

        // ⭐ Guest mode support
        const userId = session?.user?.id ?? null ;

        const res = await fetch("/api/live-interview/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId, // guest if not logged in
                role,
                interview_type: type,
                difficulty,
                question_count: questions,
                techstack,
            }),
        });

        const data = await res.json();

        if (res.ok && data.sessionId) {
            router.push(`/live-interview/${data.sessionId}`);
        } else {
            console.error("START ERROR FRONTEND:", data);
            alert("Something went wrong when starting interview.");
        }
    }

    function toggleTech(item: string) {
        if (techstack.includes(item)) {
            setTechstack(techstack.filter((t) => t !== item));
        } else {
            setTechstack([...techstack, item]);
        }
    }

    function addCustomTech() {
        if (customTech.trim() !== "") {
            setTechstack([...techstack, customTech.trim()]);
            setCustomTech("");
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Live Interview Setup</h1>

            {/* ROLE */}
            <div className="mb-5">
                <label className="text-lg font-medium">Choose Your Role *</label>
                <select
                    className="w-full mt-2 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">Select role</option>
                    {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                    ))}
                </select>
            </div>

            {/* INTERVIEW TYPE */}
            <div className="mb-5">
                <label className="text-lg font-medium">Interview Type *</label>
                <select
                    className="w-full mt-2 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="">Select type</option>
                    {TYPES.map((t) => (
                        <option key={t}>{t}</option>
                    ))}
                </select>
            </div>

            {/* DIFFICULTY */}
            <div className="mb-5">
                <label className="text-lg font-medium">Difficulty *</label>
                <select
                    className="w-full mt-2 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="">Select difficulty</option>
                    {DIFFICULTIES.map((d) => (
                        <option key={d}>{d}</option>
                    ))}
                </select>
            </div>

            {/* NUMBER OF QUESTIONS */}
            <div className="mb-5">
                <label className="text-lg font-medium">Number of Questions *</label>
                <input
                    type="number"
                    className="w-full mt-2 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                    min={1}
                    max={20}
                    value={questions}
                    onChange={(e) => setQuestions(parseInt(e.target.value))}
                />
            </div>

            {/* TECH STACK */}
            <div className="mb-5">
                <label className="text-lg font-medium">Your Tech Stack</label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                    {TECHSTACK_OPTIONS.map((t) => (
                        <button
                            key={t}
                            onClick={() => toggleTech(t)}
                            className={`p-2 rounded-lg border ${
                                techstack.includes(t)
                                    ? "bg-blue-600 border-blue-500"
                                    : "bg-neutral-800 border-neutral-700"
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex mt-3 gap-3">
                    <input
                        className="flex-1 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                        placeholder="Add custom tech"
                        value={customTech}
                        onChange={(e) => setCustomTech(e.target.value)}
                    />

                    <button
                        onClick={addCustomTech}
                        className="px-5 py-3 bg-blue-600 rounded-lg"
                    >
                        Add
                    </button>
                </div>

                {techstack.length > 0 && (
                    <div className="mt-4 text-gray-300">
                        Selected: {techstack.join(", ")}
                    </div>
                )}
            </div>

            <button
                onClick={startInterview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold mt-6"
            >
                Start Live Interview
            </button>
        </div>
    );
}
