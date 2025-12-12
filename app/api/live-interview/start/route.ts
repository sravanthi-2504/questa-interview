import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const {
            user_id,
            role,
            interview_type,
            difficulty,
            question_count,
            techstack,
        } = body;

        if (!role || !interview_type || !difficulty || !question_count) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Build row exactly matching your `interview_sessions` table
        const insertPayload: any = {
            user_id: user_id ?? null,              // guest = null
            role,
            interview_type,
            difficulty,
            techstack: Array.isArray(techstack) && techstack.length > 0
                ? techstack
                : null,
            question_count,
            total_questions: question_count,
            completed: false,
            status: "in-progress",
            transcript: [],
            current_index: 0,
            metadata_step: null,
        };

        const { data, error } = await supabase
            .from("interview_sessions")            // ✅ correct table name
            .insert(insertPayload)
            .select("id")
            .single();

        if (error) {
            console.error("START ERROR (DB):", error);
            return NextResponse.json(
                { error: "DB_ERROR", details: error.message },
                { status: 500 }
            );
        }

        if (!data?.id) {
            console.error("START ERROR: No ID returned from insert");
            return NextResponse.json(
                { error: "NO_ID_RETURNED" },
                { status: 500 }
            );
        }

        return NextResponse.json({ sessionId: data.id }, { status: 200 });
    } catch (err: any) {
        console.error("START ERROR (exception):", err);
        return NextResponse.json(
            { error: "SERVER_ERROR", details: String(err?.message ?? err) },
            { status: 500 }
        );
    }
}
