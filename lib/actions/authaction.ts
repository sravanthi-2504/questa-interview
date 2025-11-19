"use server";

import { supabaseServer } from "@/lib/supabaseServer";


// ======================
// SIGN UP
// ======================
export async function signUp({ email, password, name }: any) {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name },
        },
    });

    if (error) return { error: error.message };

    return { user: data.user };
}

// ======================
// SIGN IN  (ONLY ONE VERSION – KEEP THIS ONE)
// ======================
export async function signIn({ email, password }: any) {
    const supabase = await supabaseServer();

    console.log("🔵 TRYING LOGIN WITH:", email, password);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log("🟢 SUPABASE SIGN-IN DATA:", data);
    console.log("🔴 SUPABASE SIGN-IN ERROR:", error);

    if (error) return { error: error.message };
    return { user: data.user };
}

// ======================
// CURRENT USER
// ======================
export async function getCurrentUser() {
    const supabase = await supabaseServer();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
}

// ======================
// IS AUTHENTICATED?
// ======================
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}
