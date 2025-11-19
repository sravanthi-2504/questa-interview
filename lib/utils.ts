// lib/utils.ts

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ----------------------
// 1. Shadcn class merger
// ----------------------
export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

// ----------------------
// 2. Tech Stack Logos
// ----------------------
export function getTechLogos(techs: string[]) {
    if (!Array.isArray(techs)) return [];

    const map: Record<string, string> = {
        react: "/logos/react.png",
        "next.js": "/logos/nextjs.jpeg",
        nextjs: "/logos/nextjs.jpeg",
        javascript: "/logos/javascript.png",
        typescript: "/logos/typescript.png",
        node: "/logos/node.png",
        "node.js": "/logos/node.png",
        express: "/logos/express.png",
        java: "/logos/java.png",
        python: "/logos/python.png",
        mongodb: "/logos/mongodb.png",
        html: "/logos/html.png",
        css: "/logos/css.png",
        tailwind: "/logos/tailwind.png",

        default: "/logos/default-tech.png",
    };

    return techs.map((t) => {
        const key = t.toLowerCase();
        return {
            tech: t,
            url: map[key] || map.default,
        };
    });
}

// ----------------------
// 3. Company Logos
// (your logos are inside /covers folder)
// ----------------------
export function getCompanyLogo(company: string = "default") {
    const map: Record<string, string> = {
        amazon: "/covers/amazon.png",
        facebook: "/covers/facebook.png",
        pinterest: "/covers/pinterest.png",
        quora: "/covers/quora.png",
        reddit: "/covers/reddit.png",
        skype: "/covers/skype.png",
        spotify: "/covers/spotify.png",
        telegram: "/covers/telegram.png",
        yahoo: "/covers/yahoo.png",
        tiktok: "/covers/tiktok.svg",
        default: "/covers/default.png",
    };

    return map[company.toLowerCase()] || map.default;
}

// ----------------------
// 4. Interview Cover (these must exist)
// ----------------------
export function getCoverForId(id: string) {
    if (!id) return "/covers/default.png";

    const covers = [
        "/covers/frontend.png",
        "/covers/backend.png",
        "/covers/fullstack.png",
        "/covers/hostingerr.png",
        "/covers/default.png",
    ];

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash + id.charCodeAt(i) * 31) % covers.length;
    }

    return covers[hash];
}
