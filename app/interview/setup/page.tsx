"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InterviewSetupPage() {
    const router = useRouter();

    const [role, setRole] = useState("");
    const [type, setType] = useState("");
    const [techstack, setTechstack] = useState<string[]>([]);

    const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Analyst", "DevOps Engineer"];
    const types = ["technical", "behavioral", "mixed"];
    const techOptions = ["React", "TypeScript", "Next.js", "Node.js", "Express", "MongoDB", "JavaScript", "Java", "Python"];

    const toggleTech = (item: string) => {
        setTechstack((prev) =>
            prev.includes(item)
                ? prev.filter((t) => t !== item)
                : [...prev, item]
        );
    };

    const handleStart = () => {
        if (!role || !type || techstack.length === 0) {
            alert("Please select role, type, and at least one tech stack item.");
            return;
        }

        const query = new URLSearchParams({
            role,
            type,
            techstack: techstack.join(","),
        });

        router.push(`/interview?${query.toString()}`);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Setup Your Interview</h1>

            {/* ROLE */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold">Select Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                >
                    <option value="">Choose a role</option>
                    {roles.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>

            {/* TYPE */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold">Interview Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
                >
                    <option value="">Choose type</option>
                    {types.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            {/* TECH STACK */}
            <div className="mb-6">
                <label className="block mb-3 font-semibold">Select Tech Stack</label>
                <div className="grid grid-cols-2 gap-3">
                    {techOptions.map((tech) => (
                        <button
                            key={tech}
                            onClick={() => toggleTech(tech)}
                            className={`p-2 rounded border text-sm ${
                                techstack.includes(tech)
                                    ? "bg-indigo-600 border-indigo-500 text-white"
                                    : "bg-gray-900 border-gray-700 text-gray-300"
                            }`}
                        >
                            {tech}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleStart}
                className="btn-primary w-full mt-4 p-3 text-lg font-semibold"
            >
                Start Interview
            </button>
        </div>
    );
}
