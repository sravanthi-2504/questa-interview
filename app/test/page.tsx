import { supabase } from "@/lib/supabase/client";

export default async function TestPage() {
    const { data, error } = await supabase.from("users").select("*");

    console.log(data, error);

    return <div>Check console</div>;
}
