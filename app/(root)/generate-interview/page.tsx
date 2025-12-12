"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "MERN Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Java Developer",
    "Python Developer",
    "Mobile App Developer",
    "Android Developer",
    "iOS Developer",
    "DevOps Engineer",
    "Cloud Engineer",
    "Data Scientist",
    "ML Engineer",
    "Cybersecurity Engineer",
];

const INTERVIEW_TYPES = [
    "Technical",
    "Coding",
    "Aptitude",
    "HR",
    "Behavioral",
    "Managerial",
];

const TECH_STACKS = [
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
];

export default function InterviewSetupPage() {
    const router = useRouter();

    const [role, setRole] = useState("");
    const [customRole, setCustomRole] = useState("");

    const [interviewType, setInterviewType] = useState("");

    const [easy, setEasy] = useState("0");
    const [medium, setMedium] = useState("0");
    const [hard, setHard] = useState("0");

    const totalQuestions =
        Number(easy || 0) + Number(medium || 0) + Number(hard || 0);

    const [techstack, setTechstack] = useState<string[]>([]);
    const [customTech, setCustomTech] = useState("");

    function toggleStack(item: string) {
        if (techstack.includes(item)) {
            setTechstack(techstack.filter((t) => t !== item));
        } else {
            setTechstack([...techstack, item]);
        }
    }

    function addCustomTech() {
        const val = customTech.trim();
        if (!val) return;
        if (!techstack.includes(val)) setTechstack([...techstack, val]);
        setCustomTech("");
    }

    async function generate() {
        const finalRole = role === "Other" ? customRole.trim() : role;

        if (!finalRole) return alert("Select a role");
        if (!interviewType) return alert("Select interview type");
        if (totalQuestions <= 0) return alert("Enter at least 1 question");

        const hideTech = ["HR", "Aptitude", "Behavioral", "Managerial"].includes(
            interviewType
        );

        if (!hideTech && techstack.length === 0)
            return alert("Please select tech stack");

        router.push(
            `/interview?role=${encodeURIComponent(
                finalRole
            )}&type=${interviewType}&easy=${easy}&medium=${medium}&hard=${hard}&techstack=${encodeURIComponent(
                techstack.join(",")
            )}`
        );
    }

    const hideTechstack = ["HR", "Aptitude", "Managerial"].includes(
        interviewType
    );

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Generate Interview Questions</h1>

            {/* Role */}
            <div className="mb-6">
                <label className="text-lg">Select Role *</label>
                <select
                    className="w-full mt-2 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">Choose role</option>
                    {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                    ))}
                    <option value="Other">Other (Type manually)</option>
                </select>

                {role === "Other" && (
                    <input
                        placeholder="Enter custom role"
                        className="w-full mt-3 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                    />
                )}
            </div>

            {/* Interview Type */}
            <div className="mb-6">
                <label className="text-lg">Interview Type *</label>
                <select
                    className="w-full mt-2 p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                >
                    <option value="">Choose type</option>
                    {INTERVIEW_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                    ))}
                </select>
            </div>

            {/* Difficulty */}
            <div>
                <label className="text-lg">Difficulty Split *</label>
                <div className="grid grid-cols-3 gap-3 mt-3">
                    <input
                        type="number"
                        min="0"
                        value={easy}
                        onChange={(e) => setEasy(e.target.value)}
                        className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                        placeholder="Easy"
                    />

                    <input
                        type="number"
                        min="0"
                        value={medium}
                        onChange={(e) => setMedium(e.target.value)}
                        className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                        placeholder="Medium"
                    />

                    <input
                        type="number"
                        min="0"
                        value={hard}
                        onChange={(e) => setHard(e.target.value)}
                        className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg"
                        placeholder="Hard"
                    />
                </div>

                <p className="mt-3 text-blue-400 font-semibold">
                    Total Questions: {totalQuestions}
                </p>
            </div>

            {/* Tech stack */}
            {!hideTechstack && (
                <div className="mt-6">
                    <label className="text-lg">Tech Stack *</label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                        {TECH_STACKS.map((s) => (
                            <button
                                key={s}
                                onClick={() => toggleStack(s)}
                                className={`p-2 rounded-lg border ${
                                    techstack.includes(s)
                                        ? "bg-blue-600 border-blue-500"
                                        : "bg-neutral-800 border-neutral-700"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-3">
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
                        <p className="mt-2 text-gray-300">Selected: {techstack.join(", ")}</p>
                    )}
                </div>
            )}

            <button
                onClick={generate}
                className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg mt-8 text-lg font-semibold"
            >
                Generate Questions
            </button>
        </div>
    );
}
