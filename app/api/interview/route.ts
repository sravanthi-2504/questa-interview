import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ============================================================
   Helper: Ask Groq to generate EXACT difficulty questions
   ============================================================ */
async function generateQuestions(
    count: number,
    difficulty: "easy" | "medium" | "hard",
    type: string,
    techstack: string[] | string
) {
    const tech = Array.isArray(techstack) ? techstack.join(", ") : techstack;

    const prompt = `
Generate EXACTLY ${count} interview questions.
Difficulty MUST be strictly "${difficulty}".

Return ONLY a JSON array:
[
  { "question": "string", "difficulty": "${difficulty}" }
]

Rules:
- No explanations.
- No markdown.
- No other difficulty types.
- The array MUST contain exactly ${count} items.
- Every item MUST have difficulty: "${difficulty}".

Round Type: ${type}
Tech Stack: ${tech}

IF TYPE = "Coding":
- Use LeetCode/HackerRank/CodeChef/GFG style coding problems.

IF TYPE = "Behavioral":
- ALL questions must be scenario-based.
- MUST start with:
  "Tell me about a time..."
  "Describe a situation..."
  "How would you handle..."

IF TYPE = "Managerial":
- Focus on leadership, conflict, deadlines, decision making.
`;

    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
    });

    let raw = response.choices?.[0]?.message?.content || "";

    // Clean model formatting
    raw = raw.replace(/```json|```/g, "").trim();

    // Extract JSON array safely
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]") + 1;

    if (start === -1 || end <= start) return [];

    try {
        const arr = JSON.parse(raw.slice(start, end));
        return arr;
    } catch (e) {
        console.error("JSON PARSE FAILED:", raw);
        return [];
    }
}

/* ============================================================
   API ROUTE
   ============================================================ */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const easy = Number(body.easy) || 0;
        const medium = Number(body.medium) || 0;
        const hard = Number(body.hard) || 0;

        const type = body.type;
        const techstack = body.techstack;

        let final: any[] = [];

        if (easy > 0) {
            const res = await generateQuestions(easy, "easy", type, techstack);
            final.push(...res);
        }

        if (medium > 0) {
            const res = await generateQuestions(medium, "medium", type, techstack);
            final.push(...res);
        }

        if (hard > 0) {
            const res = await generateQuestions(hard, "hard", type, techstack);
            final.push(...res);
        }

        return NextResponse.json(final);
    } catch (err) {
        console.error("API ERROR:", err);
        return NextResponse.json([], { status: 500 });
    }
}
