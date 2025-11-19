// lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function supabaseServer() {
    const cookieStore = await cookies();

    return createRouteHandlerClient({
        cookies: () => cookieStore,
    });
}
