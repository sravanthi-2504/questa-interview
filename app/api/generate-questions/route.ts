import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const prompt = `
Generate exactly ${body.amount || 5} interview questions.
Return ONLY a JSON array of objects:

[
  {
    "question": "text",
    "difficulty": "Easy/Medium/Hard"
  }
]

Role: ${body.role}
Type: ${body.type}
Tech Stack: ${body.techstack?.join(", ")}
`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature:0.7,
        });

        const raw = response.choices?.[0]?.message?.content ?? "";

        let parsed = [];
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            console.error("❌ JSON parse failed:", raw);
            parsed = [];
        }

        return NextResponse.json(parsed);

    } catch (err) {
        console.error("API ERROR:", err);
        return NextResponse.json([]);  // fail-safe
    }
}
