import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// -------------------------------
// COMPANY LOGOS
// -------------------------------
export function getCompanyLogo(company: string = "default") {
    const logos: Record<string, string> = {
        amazon: "/covers/amazon.png",
        pinterest: "/covers/pinterest.png",
        facebook: "/covers/facebook.png",
        yahoo: "/covers/yahoo.png",
        skype: "/covers/skype.png",
        reddit: "/covers/reddit.png",
        default: "/covers/default.png"
    };

    return logos[company.toLowerCase()] ?? logos["default"];
}

// -------------------------------
// INTERVIEW COVER IMAGE
// -------------------------------
export function getCoverForId(id: string) {
    // Simple mapping using ID for variety
    const covers = [
        "/covers/cover1.png",
        "/covers/cover2.png",
        "/covers/cover3.png",
        "/covers/cover4.png",
        "/covers/cover5.png",
    ];

    if (!id) return covers[0];

    const index = Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % covers.length;

    return covers[index];
}

// --- ADD THIS NEW FUNCTION ---
export function getTechLogos(techs: string[]) {
    const map: Record<string, string> = {
        react: "/logos/react.png",
        "next.js": "/logos/nextjs.png",
        nextjs: "/logos/nextjs.png",
        node: "/logos/node.png",
        "node.js": "/logos/node.png",
        express: "/logos/express.png",
        mongodb: "/logos/mongodb.png",
        typescript: "/logos/typescript.png",
        javascript: "/logos/javascript.png",
        default: "/logos/default.png",
    };

    return techs.map((t) => {
        const key = t.trim().toLowerCase();
        return map[key] || map["default"];
    });
}

