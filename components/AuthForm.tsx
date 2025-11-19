"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";
import { signUp, signIn } from "@/lib/actions/authaction";

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
});

export default function AuthForm({ type }: { type: "sign-in" | "sign-up" }) {
    const router = useRouter();
    const isSignIn = type === "sign-in";
    const schema = isSignIn ? signInSchema : signUpSchema;

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: isSignIn
            ? { email: "", password: "" }
            : { name: "", email: "", password: "" },
    });

    const onSubmit = async (data: any) => {
        try {
            if (isSignIn) {
                const res = await signIn({
                    email: data.email,
                    password: data.password,
                });

                if (res.error) return toast.error(res.error);

                toast.success("Signed in!");
                router.push("/");
            } else {
                const res = await signUp(data);

                if (res.error) return toast.error(res.error);

                toast.success("Account created!");
                router.push("/sign-in");
            }
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    return (
        <div className="card-border lg:min-w-[566px] animate-fadeIn">
            <div className="card py-14 px-10 flex flex-col gap-6">

                {/* Logo */}
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.png" alt="logo" width={38} height={32} />
                    <h2 className="text-primary-100">Questa</h2>
                </div>

                <h3 className="text-center">Practice job interviews with AI</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="form space-y-6 mt-4">

                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your Name"
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your email address"
                            type="email"
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                        />

                        <Button className="btn" type="submit">
                            {isSignIn ? "Sign In" : "Create an Account"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link
                        href={isSignIn ? "/sign-up" : "/sign-in"}
                        className="font-bold text-primary-200 ml-1"
                    >
                        {isSignIn ? "Sign Up" : "Sign In"}
                    </Link>
                </p>
            </div>
        </div>
    );
}
