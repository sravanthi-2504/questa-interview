"use client";
import { useState } from "react";

export default function TechInput({ onAdd }) {
    const [value, setValue] = useState("");

    const handleAdd = () => {
        if (!value.trim()) return;
        onAdd(value.trim());
        setValue("");
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="p-3 rounded bg-gray-800 text-white w-full"
                placeholder="Type a technology (e.g., Rust, Go, AWS)..."
            />
            <button
                onClick={handleAdd}
                className="px-4 py-2 rounded bg-indigo-600 text-white"
            >
                Add
            </button>
        </div>
    );
}
