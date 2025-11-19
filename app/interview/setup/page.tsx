"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

const TECH_STACKS = [
    "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "Django", "Flask",
    "Java", "Spring Boot", "Kotlin", "Swift", "C#", "ASP.NET", "C++", "Python", "Rust",
    "Go", "PHP", "Laravel", "Ruby on Rails", "MySQL", "PostgreSQL", "MongoDB", "Redis",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "DevOps", "Machine Learning", "Deep Learning",
    "TensorFlow", "PyTorch", "Cybersecurity", "Blockchain"
];

export default function InterviewSetupPage() {
    const router = useRouter();

    const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
    const [customStack, setCustomStack] = useState("");
    const [interviewType, setInterviewType] = useState("");

    const [easy, setEasy] = useState("0");
    const [medium, setMedium] = useState("0");
    const [hard, setHard] = useState("0");

    const totalQuestions = Number(easy) + Number(medium) + Number(hard);

    function toggleStack(stack: string) {
        setSelectedStacks((prev) =>
            prev.includes(stack)
                ? prev.filter((s) => s !== stack)
                : [...prev, stack]
        );
    }

    function addCustomStack() {
        const value = customStack.trim();
        if (!value) return;
        if (!selectedStacks.includes(value)) {
            setSelectedStacks((prev) => [...prev, value]);
        }
        setCustomStack("");
    }

    async function handleSubmit() {
        if (!interviewType) {
            alert("Please select interview type");
            return;
        }

        if (totalQuestions <= 0) {
            alert("Enter at least 1 question");
            return;
        }

        const hide = ["HR", "Aptitude", "Managerial", "Non-Technical"].includes(interviewType);

        if (!hide && selectedStacks.length === 0) {
            alert("Select tech stacks");
            return;
        }

        // ⭐ FIX: SEND EASY, MEDIUM, HARD IN URL
        router.push(
            `/interview?role=General` +
            `&type=${interviewType}` +
            `&techstack=${selectedStacks.join(",")}` +
            `&amount=${totalQuestions}` +
            `&easy=${easy}` +
            `&medium=${medium}` +
            `&hard=${hard}`
        );
    }

    const hideTechstack = ["HR", "Aptitude", "Managerial", "Non-Technical"].includes(interviewType);

    return (
        <div className="p-6 text-white bg-black min-h-screen">
            <Card className="bg-neutral-900 border-neutral-700">
                <CardContent className="space-y-6 p-6">

                    {/* Interview Type */}
                    <div>
                        <Label>Interview Type</Label>
                        <Select onValueChange={setInterviewType}>
                            <SelectTrigger className="mt-2 bg-neutral-800 border-neutral-600">
                                <SelectValue placeholder="Choose an interview round" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-800 text-white">
                                <SelectItem value="Technical">Technical</SelectItem>
                                <SelectItem value="Coding">Coding</SelectItem>
                                <SelectItem value="Aptitude">Aptitude</SelectItem>
                                <SelectItem value="HR">HR</SelectItem>
                                <SelectItem value="Managerial">Managerial</SelectItem>
                                <SelectItem value="Behavioral">Behavioral</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tech Stacks */}
                    {!hideTechstack && (
                        <div>
                            <Label>Select Tech Stack</Label>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                                {TECH_STACKS.map((stack) => (
                                    <Button
                                        key={stack}
                                        variant={
                                            selectedStacks.includes(stack)
                                                ? "default"
                                                : "outline"
                                        }
                                        className={
                                            selectedStacks.includes(stack)
                                                ? "bg-blue-600"
                                                : "bg-neutral-800 border-neutral-600"
                                        }
                                        onClick={() => toggleStack(stack)}
                                    >
                                        {stack}
                                    </Button>
                                ))}
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Input
                                    placeholder="Add custom tech stack"
                                    value={customStack}
                                    onChange={(e) => setCustomStack(e.target.value)}
                                    className="bg-neutral-800 border-neutral-600"
                                />
                                <Button onClick={addCustomStack} className="bg-blue-600">
                                    Add
                                </Button>
                            </div>

                            {selectedStacks.length > 0 && (
                                <div className="mt-3 text-sm text-gray-300">
                                    Selected: {selectedStacks.join(", ")}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Difficulty Inputs */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Easy</Label>
                            <Input
                                type="number"
                                min="0"
                                value={easy}
                                onChange={(e) => setEasy(e.target.value)}
                                className="bg-neutral-800 border-neutral-600 mt-1"
                            />
                        </div>

                        <div>
                            <Label>Medium</Label>
                            <Input
                                type="number"
                                min="0"
                                value={medium}
                                onChange={(e) => setMedium(e.target.value)}
                                className="bg-neutral-800 border-neutral-600 mt-1"
                            />
                        </div>

                        <div>
                            <Label>Hard</Label>
                            <Input
                                type="number"
                                min="0"
                                value={hard}
                                onChange={(e) => setHard(e.target.value)}
                                className="bg-neutral-800 border-neutral-600 mt-1"
                            />
                        </div>
                    </div>

                    {/* Total Questions */}
                    <div className="text-lg font-semibold text-blue-400">
                        Total Questions: {totalQuestions}
                    </div>

                    {/* Submit Button */}
                    <Button onClick={handleSubmit} className="w-full bg-blue-600 mt-4">
                        Continue
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}
