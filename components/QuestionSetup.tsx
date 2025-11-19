"use client";

import { useState } from "react";

export default function QuestionSetup({ onGenerate }: any) {
    const [amount, setAmount] = useState(5);

    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <label className="text-white text-lg">How many questions?</label>

            <select
                className="p-3 rounded bg-neutral-800 text-white"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
            >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
            </select>

            <button
                onClick={() => onGenerate(amount)}
                className="px-5 py-3 rounded bg-purple-500 text-white"
            >
                Generate Questions
            </button>
        </div>
    );
}
