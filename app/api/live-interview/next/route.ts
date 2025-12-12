import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabaseServer } from "@/lib/supabaseServer";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// -------------------------------------------------------
// GET NEXT QUESTION (frontend uses GET, not POST)
// URL: /api/live-interview/next?sessionId=123
// -------------------------------------------------------
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json(
                { error: "Missing sessionId" },
                { status: 400 }
            );
        }

        const supabase = supabaseServer();

        // Fetch session
        const { data: session, error: sessionError } = await supabase
            .from("interview_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (sessionError || !session) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        const transcript = session.transcript ?? [];
        const asked = transcript.length;

        // Interview finished
        if (asked >= session.question_count) {
            return NextResponse.json({
                done: true,
                questions: [],
            });
        }

        // Ensure techstack is always array
        const techstack = Array.isArray(session.techstack)
            ? session.techstack
            : [];

        // Build prompt
        const prompt = `
You are an interview question generator.
Generate ONLY ONE question.

Role: ${session.role}
Round: ${session.interview_type}
Difficulty: ${session.difficulty}
Tech Stack: ${techstack.join(", ")}

Return strictly in this JSON format:
{
  "question": "string"
}
        `;

        // Call Groq
        const resp = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
        });

        let raw = resp.choices?.[0]?.message?.content || "";
        raw = raw.replace(/```json|```/g, "").trim();

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch {
            console.error("Groq malformed JSON:", raw);
            return NextResponse.json(
                { error: "AI returned invalid JSON" },
                { status: 500 }
            );
        }

        // Return in correct frontend format
        return NextResponse.json({
            questions: [parsed.question],
            done: false,
        });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        return NextResponse.json(
            { error: "Failed to load next question" },
            { status: 500 }
        );
    }
}
