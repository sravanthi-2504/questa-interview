import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/* ------------------------------------------
   Helper: LLM call
------------------------------------------ */
async function askLLM(prompt: string) {
    const r = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
    });

    return r.choices?.[0]?.message?.content ?? "";
}

/* ------------------------------------------
   Helper: Clean + parse a JSON array
------------------------------------------ */
function forceParseArray(raw: string) {
    const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/gi, "")
        .trim();

    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]") + 1;

    if (start === -1 || end === 0) return [];

    try {
        return JSON.parse(cleaned.slice(start, end));
    } catch {
        return [];
    }
}

/* ------------------------------------------
   Generate N questions for ONE difficulty
------------------------------------------ */
async function generateDifficulty(
    type: string,
    tech: string,
    diff: "easy" | "medium" | "hard",
    count: number
) {
    if (count <= 0) return [];

    // Normalize round type
    let round = type.toLowerCase();

    if (round === "technical") round = "coding";
    if (round === "non-technical") round = "behavioral";

    const prompt = `
Generate EXACTLY ${count} interview questions.

Difficulty MUST be "${diff}" ONLY.
Return ONLY a JSON array:
[
  { "question": "string", "difficulty": "${diff}" }
]

Round type: ${round}
Tech stack: ${tech}

Rules:
- No extra text
- No markdown
- Only ${diff} difficulty questions

If round = "coding":
  - Use LeetCode / HackerRank style
If round = "behavioral":
  - Start ALL questions with:
    "Tell me about a time..."
    "Describe a situation..."
    "How would you handle..."
If round = "managerial":
  - Leadership, conflict, deadlines only.
If round = "hr":
  - Culture fit, strengths, weaknesses.
If round = "aptitude":
  - Math, logic, reasoning questions.
`;

    const raw = await askLLM(prompt);
    const arr = forceParseArray(raw);

    return arr.map((q: any) => ({
        question: q?.question ?? "",
        difficulty: diff,
    }));
}

/* ------------------------------------------
   POST HANDLER
------------------------------------------ */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const type = body.type || "Technical";
        const tech = Array.isArray(body.techstack)
            ? body.techstack.join(", ")
            : body.techstack || "";

        const easy = Number(body.easy || 0);
        const medium = Number(body.medium || 0);
        const hard = Number(body.hard || 0);

        // Generate each block
        const results: any[] = [];

        if (easy > 0) results.push(...(await generateDifficulty(type, tech, "easy", easy)));
        if (medium > 0)
            results.push(...(await generateDifficulty(type, tech, "medium", medium)));
        if (hard > 0) results.push(...(await generateDifficulty(type, tech, "hard", hard)));

        // FINAL check
        const final = results.filter((q) => q.question.trim() !== "");

        return NextResponse.json(final);
    } catch (err) {
        console.error("Interview API Error:", err);
        return NextResponse.json([], { status: 500 });
    }
}
