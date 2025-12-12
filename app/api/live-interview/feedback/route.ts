import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabaseServer } from "@/lib/supabaseServer";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { sessionId } = await req.json();
        const supabase = supabaseServer();

        const { data: session } = await supabase
            .from("interview_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

        const transcript = session.transcript ?? [];

        const prompt = `
You are an AI Interview Coach.
Analyze the transcript below and provide detailed feedback.

Transcript:
${JSON.stringify(transcript, null, 2)}

Return STRICT JSON:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "summary": string
}
        `;

        const resp = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
        });

        const raw = resp.choices[0]?.message?.content ?? "";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleaned);

        await supabase
            .from("interview_sessions")
            .update({
                completed: true,
                final_score: result.score,
                strengths: result.strengths,
                weaknesses: result.weaknesses,
                summary: result.summary
            })
            .eq("id", sessionId);

        return NextResponse.json(result);

    } catch (err) {
        console.error("FEEDBACK ERROR:", err);
        return NextResponse.json({ error: "Failed to generate feedback" }, { status: 500 });
    }
}
