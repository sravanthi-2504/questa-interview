"use server";

import { supabaseServer } from "@/lib/supabase/server";

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
// SIGN IN
// ======================
export async function signIn({ email, password }: any) {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

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
