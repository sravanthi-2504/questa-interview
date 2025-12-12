import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, question, answer } = body;

        const supabase = supabaseServer();

        // get existing transcript
        const { data: session } = await supabase
            .from("interview_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        const updatedTranscript = [
            ...session.transcript,
            { question, answer }
        ];

        await supabase
            .from("interview_sessions")
            .update({ transcript: updatedTranscript })
            .eq("id", sessionId);

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("ANSWER ERROR:", err);
        return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
    }
}
