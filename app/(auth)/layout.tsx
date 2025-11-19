import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Questa – Auth",
    description: "AI powered interview practice",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="auth-layout">
            {children}
        </div>
    );
}
